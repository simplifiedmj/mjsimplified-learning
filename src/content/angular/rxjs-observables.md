---
title: "Understanding RxJS Observables and Streams in Angular"
slug: "rxjs-observables"
category: "angular"
description: "Master reactive programming in Angular using RxJS Observables. Learn key operators like map, filter, switchMap, and strategies to prevent memory leaks."
date: "2026-05-18"
thumbnail: "/images/tutorials/rxjs-observables.jpg"
tags: ["Angular", "RxJS", "TypeScript", "Reactive Programming"]
author: "MJSimplified"
---

Angular leverages **RxJS (Reactive Extensions for JavaScript)** heavily for managing asynchronous tasks and state changes. Whether you are dealing with HTTP requests, routing events, forms controls, or custom events, you are dealing with **Observables** and stream data.

In this tutorial, we will break down what Observables are, review critical pipeline operators, and show you how to handle subscription lifecycles securely.

## 1. What is an Observable?

An **Observable** represents a stream of asynchronous values that can be pushed over time. Think of it like a YouTube channel:
* The channel is the **Observable** (it publishes videos over time).
* You are the **Observer/Subscriber** (you receive videos when you subscribe).
* The action of clicking Subscribe is equivalent to calling the `.subscribe()` method. If no one subscribes, the channel publishes but nobody receives the content (this is a **Cold Observable**).

Here is how you create a simple custom Observable:

```typescript
import { Observable } from 'rxjs';

const stream$ = new Observable<string>(subscriber => {
  subscriber.next('First Video');
  subscriber.next('Second Video');
  
  // Asynchronous emission
  setTimeout(() => {
    subscriber.next('Third Video');
    subscriber.complete(); // Finishes the stream
  }, 2000);
});

// To consume the values, you must subscribe:
stream$.subscribe({
  next: value => console.log('Received:', value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Stream completed!')
});
```

## 2. Power of RxJS: Pipe and Operators

Operators are functions that transform, filter, or combine the streams of data before they reach the subscriber. We use the `.pipe()` method to chain them together.

### A. Transform Data with `map`
`map` operates similarly to the standard JS array mapping:

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5); // Emits values individually

numbers$.pipe(
  map(val => val * 10)
).subscribe(val => console.log(val)); 
// Output: 10, 20, 30, 40, 50
```

### B. Filter Streams with `filter`
Allows only specific values to pass through:

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(
  filter(val => val % 2 === 0)
).subscribe(val => console.log(val)); 
// Output: 2, 4
```

### C. Cancel Inflight Requests with `switchMap`
`switchMap` is essential for search-type-ahead forms. It maps each emission to a new inner Observable and cancels previous active HTTP requests:

```typescript
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export class SearchComponent {
  private searchTerms = new Subject<string>();
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),        // Wait 300ms after keystroke
      distinctUntilChanged(),   // Only search if search term changed
      switchMap(term => this.http.get(`/api/search?q=${term}`))
    ).subscribe(results => {
      console.log(results);
    });
  }

  search(term: string) {
    this.searchTerms.next(term);
  }
}
```

## 3. Subscription Management and Memory Leaks

If you subscribe to an Observable in an Angular component, that subscription remains active in memory even if the component is destroyed. This causes serious **memory leaks**.

Here are three ways to manage subscription lifecycles correctly:

### Option A: Manual Unsubscription
Unsubscribe inside the `ngOnDestroy` hook:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({ ... })
export class TimerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = interval(1000).subscribe(val => console.log(val));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### Option B: The `takeUntil` Operator (Recommended for multiple streams)
Uses a Subject to signal completion of all subscriptions simultaneously:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ ... })
export class FeedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(1000).pipe(takeUntil(this.destroy$)).subscribe(val => console.log(val));
    interval(5000).pipe(takeUntil(this.destroy$)).subscribe(val => console.log("Slow", val));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Option C: The Async Pipe (`| async`) (Best Practice)
The async pipe automatically subscribes and, critically, **unsubscribes** when the component is destroyed. No TypeScript lifecycle code is required!

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-list',
  template: `
    <ul>
      <li *ngFor="let item of items$ | async">{{ item.name }}</li>
    </ul>
  `,
  standalone: true
})
export class ListComponent {
  items$: Observable<any[]>;

  constructor(private dataService: DataService) {
    this.items$ = this.dataService.getItems();
  }
}
```
Using the async pipe makes your code cleaner, more declarative, and completely safe from memory leaks.
