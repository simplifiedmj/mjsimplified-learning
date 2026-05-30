---
title: "Understanding Database Indexing: How Indexes Speed Up Queries"
slug: "database-indexing"
category: "database"
description: "A deep dive into database indexes, B-Trees, and how they optimize search times from O(N) to O(log N). Learn when to index and when to avoid it."
date: "2026-05-20"
thumbnail: "/images/tutorials/db-indexing.jpg"
tags: ["SQL", "DBMS", "Database Indexing", "Performance Optimization"]
author: "MJSimplified"
---

As your application grows, the volume of data stored in your database will increase. Without proper optimization, queries that once took milliseconds will start taking seconds, leading to slow page loads and a poor user experience. 

The single most effective tool to solve slow read queries is **Database Indexing**. In this article, we'll explain how indexes work under the hood, focus on B-Trees, and review best practices.

## 1. What is a Database Index?

Think of a database index like the index at the back of a textbook. If you want to find information about "indexing" in a 500-page book, you don't scan every page starting from page one (which is a **Table Scan**). Instead, you flip to the back index, look up "indexing", see that it's discussed on pages 123-125, and jump directly to those pages.

In databases, an index is a separate data structure (usually a **B-Tree**) that stores the values of specific columns and points directly to the physical row where those values reside.

## 2. B-Tree Indexes: The Default Choice

Most relational databases (PostgreSQL, MySQL) use **B-Trees** (Balanced Trees) as their default indexing structure. 

A B-Tree keeps data sorted and allows search, sequential access, insertions, and deletions in logarithmic time: $O(\log N)$.

```
            [  50  ]
           /        \
      [ 25 ]        [ 75 ]
     /     \        /    \
  [10,20] [30,40] [60,70] [80,90]
```

When you search for `id = 30`:
1. The engine checks the root node `[50]`. Since 30 is less than 50, it goes to the left child.
2. It looks at `[25]`. Since 30 is greater than 25, it goes to the right child.
3. It searches the leaf node `[30,40]` and finds `30` immediately.

Instead of scanning millions of records, the database engine makes a handful of disk page lookups.

## 3. How to Create an Index

Creating an index is straightforward using SQL:

```sql
-- Create a standard index on a single column
CREATE INDEX idx_employees_last_name 
ON employees(last_name);
```

You can also create a **Composite Index** on multiple columns:

```sql
-- Create a compound index
CREATE INDEX idx_employees_dept_salary
ON employees(department_id, salary);
```

> **Important**: The order of columns in a composite index matters. The index above is highly optimized for queries filtering on `department_id` OR on `department_id` and `salary` together. It cannot be used efficiently for queries filtering on `salary` alone.

## 4. The Cost of Indexing

While indexes dramatically speed up read queries (`SELECT`), they are not free. They have two main costs:

1. **Storage Space**: Indexes are written to disk. A table with many indexes can consume double or triple the disk space of the raw table.
2. **Write Performance**: Every time you perform an `INSERT`, `UPDATE`, or `DELETE`, the database engine must not only modify the table data but also update all relevant indexes to keep them in sync.

Therefore, you should not index every column blindly. 

## 5. Indexing Best Practices

* **Index Foreign Keys**: Relational databases perform joins on foreign key columns constantly. Indexing these columns speeds up joins dramatically.
* **Index Frequently Searched Columns**: Columns that appear in `WHERE`, `ORDER BY`, or `GROUP BY` clauses are prime candidates for indexing.
* **Use Unique Indexes for Constraints**: Unique indexes double as constraints, preventing duplicate records (e.g., email addresses).
* **Avoid Indexing Low-Cardinality Columns**: If a column only has a few distinct values (e.g., `gender` or `status`), indexing it rarely helps because the database engine will likely decide a full table scan is cheaper.
* **Use EXPLAIN to Analyze**: Prefix your query with `EXPLAIN` or `EXPLAIN ANALYZE` to verify whether the database is using your index or performing a table scan:

```sql
EXPLAIN ANALYZE 
SELECT * FROM employees 
WHERE last_name = 'Smith';
```
