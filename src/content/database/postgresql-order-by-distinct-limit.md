---
title: "SQL SELECT Query: ORDER BY, DISTINCT, and LIMIT in PostgreSQL"
slug: "postgresql-order-by-distinct-limit"
category: "database"
description: "Master essential SQL selection techniques in PostgreSQL. Learn how to sort query results with ORDER BY, remove duplicates with DISTINCT, and paginate results with LIMIT & OFFSET using the employee table schema."
date: "2026-05-31"
thumbnail: "/images/tutorials/postgres-order-limit.jpg"
tags: ["PostgreSQL", "SQL", "Database Basics", "Queries"]
author: "MJSimplified"
youtubeId: "ORY5Qujv3_0"
youtubeIds: ["ORY5Qujv3_0", "lG7dowDFLIY"]
---

In relational databases, querying data is not just about retrieving raw rows. To build practical applications, you must know how to organize, refine, and paginate your query results. 

In this third episode of our Database series, we will focus on three key SQL clauses: **`ORDER BY`** (sorting), **`DISTINCT`** (uniqueness), and **`LIMIT`** (pagination). We will use our core `employee` table schema to see these clauses in action.

---

## 1. Setup: Sample Data

Let's assume we have our `employee` table populated with the following records:

```sql
CREATE TABLE employee (
    emp_id INT,
    emp_name VARCHAR(100),
    emp_salary DECIMAL,
    emp_department VARCHAR(100)
);

INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department) 
VALUES 
  (1, 'AMAN', 100000.00, 'SALES'),
  (2, 'PRIYA', 120000.00, 'ENGINEERING'),
  (3, 'VIKRAM', 95000.00, 'MARKETING'),
  (4, 'NEHA', 80000.00, 'SALES'),
  (5, 'KABIR', 120000.00, 'ENGINEERING'),
  (6, 'RAM', 85000.00, 'MARKETING'),
  (7, 'SARA', 95000.00, 'SALES');
```

---

## 2. ORDER BY (Controls Sorting)

By default, database query results are returned in no guaranteed order. To sort rows, we append the `ORDER BY` clause.

### A. Ascending vs. Descending Order
* `ASC` sorts in ascending order (A-Z, lowest number to highest). This is the default.
* `DESC` sorts in descending order (Z-A, highest number to lowest).

```sql
-- Sort employees by salary from highest to lowest
SELECT emp_name, emp_salary, emp_department
FROM employee
ORDER BY emp_salary DESC;
```

### B. Sorting by Multiple Columns
You can specify multiple columns in `ORDER BY`. The database engine will sort by the first column, and if there are duplicate values, it will sort them using the second column:

```sql
-- Sort by department (ascending), then by salary (descending) within each department
SELECT emp_name, emp_department, emp_salary
FROM employee
ORDER BY emp_department ASC, emp_salary DESC;
```

### C. Advanced: Sorting NULL Values (PostgreSQL Specific)
If your table contains `NULL` values, PostgreSQL allows you to specify where they should appear using `NULLS FIRST` or `NULLS LAST`:

```sql
-- Sort by salary ascending, placing any NULL salaries at the very end
SELECT emp_name, emp_salary
FROM employee
ORDER BY emp_salary ASC NULLS LAST;
```

---

## 3. DISTINCT (Removes Duplicates)

The `DISTINCT` keyword is used in the `SELECT` list to filter out duplicate rows and return unique values.

### A. Finding Unique Values in a Single Column
To find all the unique departments represented in our workforce:

```sql
SELECT DISTINCT emp_department
FROM employee;
```
*Output: `SALES`, `ENGINEERING`, `MARKETING`*

### B. Distinct on Multiple Columns
If you list multiple columns after `DISTINCT`, the query returns rows where the *combination* of those columns is unique:

```sql
-- Returns unique department and salary pairings
SELECT DISTINCT emp_department, emp_salary
FROM employee;
```

### C. Advanced: DISTINCT ON (PostgreSQL Special Feature)
In standard SQL, retrieving complete rows based on distinct values of a single column is complex. PostgreSQL offers the unique `DISTINCT ON (expression)` clause to achieve this easily. It returns the first row for each distinct value of the specified column:

```sql
-- Get the highest paid employee in each department
SELECT DISTINCT ON (emp_department) emp_department, emp_name, emp_salary
FROM employee
ORDER BY emp_department, emp_salary DESC;
```
> **Important**: When using `DISTINCT ON`, the columns in the `DISTINCT ON` parentheses must match the left-most columns in the `ORDER BY` clause.

---

## 4. LIMIT & OFFSET (Restricts Rows)

When query results contain millions of records, sending all of them to the frontend slows down performance. We use `LIMIT` to restrict the size of the result set.

### A. Limiting the Number of Returned Rows
To find the top 3 highest-earning employees:

```sql
SELECT emp_name, emp_salary
FROM employee
ORDER BY emp_salary DESC
LIMIT 3;
```

> **Rule of Thumb**: Always combine `LIMIT` with `ORDER BY`. Without sorting, the rows returned by `LIMIT` are non-deterministic (meaning they depend on the physical layout on disk and could change).

### B. Pagination with OFFSET
To fetch subsets of data sequentially (e.g. page 1, page 2), combine `LIMIT` with `OFFSET`.
* `LIMIT` = Page Size (how many rows to return).
* `OFFSET` = Page Index (how many rows to skip).

```sql
-- Fetch Page 2 of employees (assuming page size of 2)
-- Skip the first 2 rows, and return the next 2
SELECT emp_name, emp_salary, emp_department
FROM employee
ORDER BY emp_id ASC
LIMIT 2 OFFSET 2;
```

### C. Performance Tip: The Cost of Large Offsets
While `LIMIT ... OFFSET` is standard for pagination, it does not scale well on massive tables. If you write `OFFSET 1000000 LIMIT 10`, the database engine must still scan and discard the first 1,000,000 rows before returning the 10 rows. For large tables, consider **Keyset Pagination** (using `WHERE id > last_seen_id` with `LIMIT`).
