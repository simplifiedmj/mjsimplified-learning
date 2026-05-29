---
title: "Market Data Processing: Engineering Ultra-Fast Feed Handlers"
slug: "market-data-processing"
category: "finance"
description: "Learn how modern financial systems process market data feeds at scale. Covers UDP multicast, packet binary serialization, and ring buffer architectures."
date: "2026-05-25"
thumbnail: "/images/tutorials/market-data.jpg"
tags: ["Finance Tech", "Market Data", "Low Latency", "UDP Multicast", "System Performance"]
youtubeId: "J23yDq5m1u4"
author: "MJSimplified"
---

Financial exchanges generate hundreds of millions of updates per second as traders submit, modify, and cancel orders. To make intelligent trading decisions, algorithms must parse and ingest this stream of **Market Data** in real-time, matching the exchange's speed.

In this tutorial, we will cover how feed handlers process UDP multicast feeds, parse high-performance binary protocols, and push updates using thread-safe ring-buffers.

## 1. Network Delivery: UDP Multicast

Unlike standard web APIs that use TCP for reliable connections, exchanges broadcast market data over **UDP Multicast**. 
* **Multicast** allows the exchange to publish a packet once and have it distributed across thousands of downstream clients via network switches, minimizing egress network load.
* **UDP** is used because it has no handshake or packet-retransmission overhead, guaranteeing lowest latency.

```
                  +-----------------------+
                  | Exchange Feed Source  |
                  +-----------------------+
                              | (Single Egress Stream)
                              v
                  +-----------------------+
                  | Network Switch Router |
                  +-----------------------+
                   /          |          \
                  v           v           v
            [Trader A]   [Trader B]   [Trader C]
```

### The Trade-off: Packet Loss
Because UDP is unreliable, packets can arrive out-of-order or disappear entirely. Feed handlers solve this by maintaining **A/B Feed Ingestion**:
* The exchange broadcasts identical feeds over two separate networks (Feed A and Feed B).
* The feed handler joins both multicast groups. If Feed A drops packet #4529, the handler checks if Feed B received it.
* If both feeds miss packet #4529, the handler triggers a separate TCP **historical replay request** to catch up.

## 2. Parsing Binary Protocols: ITCH Example

Modern feeds do not send text data (like JSON or CSV) because parsing text strings is too slow. Instead, they broadcast raw binary packets.

Let's look at the standard **Nasdaq ITCH** protocol layout for an **Add Order Message** (Type `A`):

| Offset | Field | Length (Bytes) | Type | Description |
|---|---|---|---|---|
| 0 | Message Type | 1 | Alpha | Always `A` |
| 1 | Stock Locate | 2 | Integer | Internal stock code |
| 3 | Tracking Number | 2 | Integer | Session tracking |
| 5 | Timestamp | 6 | Integer | Nanoseconds since midnight |
| 11 | Order Reference | 8 | Integer | Unique identifier for order |
| 19 | Buy/Sell Indicator | 1 | Alpha | `B` = Buy, `S` = Sell |
| 20 | Shares | 4 | Integer | Number of shares |
| 24 | Stock | 8 | Alpha | Ticker symbol padding with spaces |
| 32 | Price | 4 | Integer | Price scale by 4 decimal points |

### Implementing a Binary Parser in TypeScript/Node.js
Using JavaScript's `Buffer` or `ArrayBuffer` allows us to read these values with zero-allocation slicing:

```typescript
export interface AddOrderMessage {
  messageType: string;
  timestamp: bigint;
  orderId: bigint;
  side: 'B' | 'S';
  shares: number;
  symbol: string;
  price: number;
}

export function parseAddOrderMessage(buffer: Buffer): AddOrderMessage {
  // Offset 0: Message Type (1 byte)
  const messageType = buffer.toString('ascii', 0, 1);
  
  if (messageType !== 'A') {
    throw new Error('Invalid message type');
  }

  // Offset 5: Timestamp (6 bytes - BigEndian)
  // We can read it as 48-bit unsigned integer
  const timestamp = buffer.readUIntBE(5, 6);

  // Offset 11: Order ID (8 bytes - BigInt)
  const orderId = buffer.readBigUInt64BE(11);

  // Offset 19: Side (1 byte)
  const side = buffer.toString('ascii', 19, 20) as 'B' | 'S';

  // Offset 20: Shares (4 bytes - Int)
  const shares = buffer.readUInt32BE(20);

  // Offset 24: Symbol (8 bytes - space padded string)
  const symbol = buffer.toString('ascii', 24, 32).trim();

  // Offset 32: Price (4 bytes - Scaled integer, e.g., 10000 = $1.00)
  const rawPrice = buffer.readUInt32BE(32);
  const price = rawPrice / 10000.0;

  return {
    messageType,
    timestamp: BigInt(timestamp),
    orderId,
    side,
    shares,
    symbol,
    price
  };
}
```

## 3. High-Throughput Buffering: Ring Buffers

A single feed handler runs two primary threads to keep up with incoming market rates:
1. **Network Thread**: Listens to socket interfaces, grabs UDP packets, and places them onto a queue as fast as possible. It does zero parsing.
2. **Parsing Thread**: Dequeues packets, parses them, updates the order book, and triggers trading algorithms.

Using standard thread-safe locks (`synchronized` in Java or Mutexes in C++) on the queue creates CPU bottlenecking. Instead, low-latency platforms utilize **Ring Buffers** (such as the LMAX Disruptor):
* A pre-allocated, fixed-size circular array.
* Uses lock-free memory barrier operations instead of OS threads sleeping on locks.
* Extremely high throughput (exceeding 20 million events per second).
