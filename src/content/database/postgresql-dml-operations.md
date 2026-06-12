---
title: "PostgreSQL DML Operations: Deep Dive into Insert, Update, Delete, and Upsert"
slug: "postgresql-dml-operations"
category: "database"
description: "Master Data Manipulation Language (DML) in PostgreSQL. Learn advanced INSERT patterns, UPDATE joins, DELETE returning, and the powerful ON CONFLICT upsert mechanism using the employee schema."
date: "2026-05-30"
thumbnail: "/images/tutorials/postgres-dml.jpg"
tags: ["PostgreSQL", "SQL", "DML", "Database Internals"]
youtubeId: "Uiu00vXfsXg"
author: "MJSimplified"
---

In relational databases, **Data Manipulation Language (DML)** is the subset of SQL used to insert, modify, and delete data within tables. Following our introductory database guide, we will build upon the **`employee`** table structure to master write operations, analyze PostgreSQL-specific syntax like the `RETURNING` clause, and explore the `ON CONFLICT` upsert capability.

In this tutorial, we will use our core `employee` table:

```sql
CREATE TABLE employee (
    emp_id INT,
    emp_name VARCHAR(100),
    emp_salary DECIMAL,
    emp_department VARCHAR(100)
);
```

---

## 1. The INSERT Statement

Inserting data in PostgreSQL can range from adding a single record to executing massive bulk uploads.

### A. Inserting Single and Multiple Rows
Explicitly listing the columns is best practice to prevent breakage when table schemas change or columns are reordered:

```sql
-- Single row insert (from our first video)
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department)
VALUES (1, 'AMAN', 100000.00, 'SALES');

-- Inserting multiple rows in a single query (bulk insert)
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department)
VALUES 
  (2, 'PRIYA', 120000.00, 'ENGINEERING'),
  (3, 'VIKRAM', 95000.00, 'MARKETING'),
  (4, 'NEHA', 80000.00, 'SALES');
```

### B. INSERT with Subqueries (SELECT)
You can populate a table dynamically using the output of a query. Let's create an archive table to hold deactivated or historical marketing employees:

```sql
-- Create the archive table
CREATE TABLE archived_employee (
    emp_id INT,
    emp_name VARCHAR(100),
    archived_at TIMESTAMP
);

-- Insert marketing department employees into the archive table
INSERT INTO archived_employee (emp_id, emp_name, archived_at)
SELECT emp_id, emp_name, NOW()
FROM employee
WHERE emp_department = 'MARKETING';
```

### C. The RETURNING Clause (PostgreSQL Specific)
Normally, an `INSERT` command only returns the count of affected rows. If you want to return the newly inserted data (like auto-generated audit fields, default values, or keys) to your calling application directly, use the `RETURNING` clause:

```sql
-- Insert a new employee and return details immediately
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department)
VALUES (5, 'KABIR', 115000.00, 'ENGINEERING')
RETURNING emp_id, emp_name, emp_salary;
```

---

## 2. The UPDATE Statement

The `UPDATE` statement modifies existing values inside a table.

### A. Standard Update with WHERE
A basic update alters specific columns for rows matching a predicate:

```sql
-- Give a 10% raise to all employees in the SALES department
UPDATE employee
SET emp_salary = emp_salary * 1.10
WHERE emp_department = 'SALES';
```
> **Warning**: Always verify your `WHERE` clause before running an `UPDATE`. Omitting `WHERE` will modify every single record in the table!

### B. UPDATE with JOINs (Using the FROM Clause)
If you need to update rows in one table based on values stored in another, PostgreSQL supports the `FROM` syntax. Let's create a **`departments`** configuration table to hold bonus values:

```sql
-- Create departments table
CREATE TABLE departments (
    dept_name VARCHAR(100),
    bonus_percentage DECIMAL
);

-- Insert lookup details
INSERT INTO departments (dept_name, bonus_percentage)
VALUES 
  ('SALES', 0.15), 
  ('ENGINEERING', 0.20),
  ('MARKETING', 0.10);

-- Update employee salaries by joining with the departments table
UPDATE employee e
SET emp_salary = e.emp_salary * (1 + d.bonus_percentage)
FROM departments d
WHERE e.emp_department = d.dept_name;
```

### C. RETURNING Updated Values
You can verify the updated results immediately using the `RETURNING` clause:

```sql
UPDATE employee
SET emp_salary = emp_salary + 5000
WHERE emp_department = 'ENGINEERING'
RETURNING emp_id, emp_name, emp_salary;
```

---

## 3. The DELETE Statement

The `DELETE` statement removes rows from a table.

### A. Standard Delete
Removes records matching the condition:

```sql
-- Delete employees earning less than 90,000.00
DELETE FROM employee
WHERE emp_salary < 90000.00;
```

### B. DELETE with JOINs (Using the USING Clause)
To delete rows by joining against another table, PostgreSQL uses the `USING` clause:

```sql
-- Delete employees who work in departments with low bonus percentages
DELETE FROM employee e
USING departments d
WHERE e.emp_department = d.dept_name
  AND d.bonus_percentage < 0.12;
```

### C. DELETE vs TRUNCATE
While both remove data, they operate differently:

| Feature | DELETE | TRUNCATE |
|---|---|---|
| **SQL Category** | DML (Data Manipulation) | DDL (Data Definition) |
| **Speed** | Slow (processes row-by-row) | Extremely Fast (deallocates disk pages) |
| **Transaction Safe** | Yes (can rollback) | Yes (in PostgreSQL, it is transaction-safe) |
| **WHERE Clause** | Supported | Not Supported (removes all rows) |
| **Locks** | Row-level locks | Exclusive table-level lock |

---

## 4. The UPSERT Statement (INSERT ... ON CONFLICT)

An **Upsert** is a hybrid operation: it inserts a row if it doesn't exist, or updates it if it does. PostgreSQL implements this using the `ON CONFLICT` clause, which triggers when a unique constraint or primary key violation occurs.

To use this feature, we must first add a **Unique Constraint** on the column check (in this case, `emp_id`):

```sql
-- Add a unique constraint to emp_id
ALTER TABLE employee ADD CONSTRAINT unique_emp_id UNIQUE (emp_id);
```

### A. Option 1: DO NOTHING (Ignore Conflicts)
If the employee ID already exists, skip it without throwing an error:

```sql
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department)
VALUES (1, 'AMAN', 105000.00, 'SALES')
ON CONFLICT (emp_id) 
DO NOTHING;
```

### B. Option 2: DO UPDATE (Update Existing Rows)
If the employee ID already exists, update specific fields. You can use the special **`EXCLUDED`** table to reference the values you attempted to insert:

```sql
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department)
VALUES (1, 'AMAN', 110000.00, 'SALES')
ON CONFLICT (emp_id) 
DO UPDATE SET 
  emp_salary = EXCLUDED.emp_salary,
  emp_department = EXCLUDED.emp_department;
```

---

## 5. PostgreSQL DML Internals & Performance

Understanding PostgreSQL's internal storage mechanism is key to writing high-performance DML statements.

### A. MVCC (Multi-Version Concurrency Control)
PostgreSQL handles concurrent operations using **MVCC**.
* When you **INSERT** a row, a new physical tuple is written to disk.
* When you **DELETE** a row, PostgreSQL does not immediately erase it. Instead, it marks the row as deleted (updating its internal metadata).
* When you **UPDATE** a row, PostgreSQL performs a `DELETE` followed by an `INSERT` under the hood. The old row is marked as dead, and a new version is created.

### B. The Need for VACUUM
Because deleted and modified rows are left on disk as "dead tuples," table files will grow (table bloat) and slow down scans. The PostgreSQL **Autovacuum** daemon runs in the background to sweep up these dead tuples and reclaim storage space.

### C. Write-Ahead Logging (WAL)
Every DML change is written to the **Write-Ahead Log (WAL)** in memory before the data pages are modified on disk. Wrapping multi-row inserts or updates inside a single explicit transaction speeds up execution by avoiding multiple WAL disk syncs:

```sql
BEGIN;
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department) VALUES (6, 'RAM', 85000.00, 'MARKETING');
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department) VALUES (7, 'SARA', 92000.00, 'SALES');
COMMIT;
```
