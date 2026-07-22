---
title: "PostgreSQL Aggregate Functions: COUNT, SUM, AVG, MIN, and MAX"
slug: "postgresql-aggregate-functions"
category: "database"
description: "Deep dive into PostgreSQL aggregate functions. Learn how to count rows, calculate sums and averages, find minimum or maximum values, handle NULL values, and use DISTINCT inside aggregates using the employee schema."
date: "2026-06-01"
thumbnail: "/images/tutorials/postgres-aggregates.jpg"
tags: ["PostgreSQL", "SQL", "Database Basics", "Functions"]
author: "MJSimplified"
---

When querying databases, you often need to summarize large sets of data rather than looking at individual rows. PostgreSQL provides powerful **Aggregate Functions** to perform mathematical calculations on a set of values and return a single summary value.

In this tutorial, we will take a deep dive into the five core SQL aggregate functions: **`COUNT`**, **`SUM`**, **`AVG`**, **`MIN`**, and **`MAX`**. We will explore how they handle duplicates and `NULL` values, and how to combine them for comprehensive reports.

---

## 1. Setup: Sample Data

We will use our standard `employee` table populated with sample records. Note that we have added an employee with a `NULL` salary to demonstrate how aggregates handle missing data:

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
  (7, 'SARA', 95000.00, 'SALES'),
  (8, 'TINA', NULL, 'HR'); -- Note: NULL salary for TINA
```

---

## 2. COUNT() — Counting Records

The `COUNT()` function returns the number of rows that match a specific criteria. It can be used in three distinct ways:

### A. COUNT(*)
Counts every single row in the table, regardless of whether columns contain duplicate or `NULL` values.
```sql
SELECT COUNT(*) AS total_rows FROM employee;
```
*Output: `8`*

### B. COUNT(column_name)
Counts only rows where the specified column is **not NULL**.
```sql
-- Counts only employees with a defined salary
SELECT COUNT(emp_salary) AS salaried_count FROM employee;
```
*Output: `7` (ignores TINA whose salary is NULL)*

### C. COUNT(DISTINCT column_name)
Counts only the unique, non-null values in a column.
```sql
-- Counts unique departments
SELECT COUNT(DISTINCT emp_department) AS unique_depts FROM employee;
```
*Output: `4` (`SALES`, `ENGINEERING`, `MARKETING`, `HR`)*

---

## 3. SUM() — Calculating Totals

The `SUM()` function adds up all non-null values in a numeric column. 

```sql
SELECT SUM(emp_salary) AS total_payroll FROM employee;
```
*Output: `695000.00`*

> **Behavior with NULLs**: `SUM()` completely ignores `NULL` values. If the table is empty or all values in the column are `NULL`, `SUM()` returns `NULL`.
> If you want to return `0` instead of `NULL` when there are no values, combine it with `COALESCE`:
> ```sql
> SELECT COALESCE(SUM(emp_salary), 0) AS safe_total FROM employee;
> ```

---

## 4. AVG() — Finding the Mean

The `AVG()` function calculates the average (mean) of all non-null values in a numeric column.

```sql
SELECT AVG(emp_salary) AS average_salary FROM employee;
```
*Output: `99285.71`*

### Important Considerations:
1. **NULL Impact**: `AVG()` does not divide the total sum by the count of all rows. It divides the sum by the count of **non-null** rows.
   - For our sample data, the calculation is: `695,000.00 / 7` (ignoring TINA), not `695,000.00 / 8`.
2. **Integer Division**: In PostgreSQL, if you pass an integer column to `AVG()`, it may truncate decimals. To get precise averages of integers, cast the column to a decimal type first:
   ```sql
   -- Cast integer column to numeric for precision
   SELECT AVG(emp_id::numeric) FROM employee;
   ```

---

## 5. MIN() and MAX() — Extreme Values

`MIN()` returns the smallest value, and `MAX()` returns the largest value in a column. 

```sql
SELECT MIN(emp_salary) AS lowest_salary, 
       MAX(emp_salary) AS highest_salary 
FROM employee;
```
*Output: lowest_salary = `80000.00`, highest_salary = `120000.00`*

### Aggregating Non-Numeric Types:
Unlike `SUM()` and `AVG()`, you can use `MIN()` and `MAX()` on text/character and date/timestamp columns:
* **For Strings**: Evaluates values alphabetically (A-Z).
  ```sql
  SELECT MIN(emp_name) AS first_alphabetical, 
         MAX(emp_name) AS last_alphabetical 
  FROM employee;
  ```
  *Output: first_alphabetical = `AMAN`, last_alphabetical = `VIKRAM`*
* **For Dates**: `MIN()` returns the oldest date, and `MAX()` returns the most recent date.

---

## 6. Combining Multiple Aggregates

You can execute multiple aggregate functions in a single `SELECT` statement to compile a summary dashboard of your data:

```sql
SELECT 
    COUNT(*) AS total_staff,
    COUNT(emp_salary) AS salaried_staff,
    SUM(emp_salary) AS total_payroll,
    AVG(emp_salary) AS average_salary,
    MIN(emp_salary) AS min_salary,
    MAX(emp_salary) AS max_salary
FROM employee;
```

**Output:**
| total_staff | salaried_staff | total_payroll | average_salary | min_salary | max_salary |
|---|---|---|---|---|---|
| 8 | 7 | 695000.00 | 99285.71 | 80000.00 | 120000.00 |

By mastering these aggregate functions, you have laid the groundwork for advanced database queries. In our next tutorial, we will learn how to group these aggregate metrics by categories using the `GROUP BY` and `HAVING` clauses.
