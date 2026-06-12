---
title: "Introduction to Databases: RDBMS, PostgreSQL Installation, and SQL Basics"
slug: "introduction-to-databases"
category: "database"
description: "Welcome to the Database series! Learn the core concepts of data, databases, RDBMS vs NoSQL, and follow step-by-step instructions to install PostgreSQL, create tables, and insert records."
date: "2026-05-29"
thumbnail: "/images/tutorials/db-intro.jpg"
tags: ["DBMS", "SQL", "PostgreSQL", "Database Basics"]
youtubeId: "TzBlHQu5vlQ"
author: "MJSimplified"
---

Welcome to the first article in our Database Series! In this guide, we will start from absolute scratch. We will define what data is, understand how databases store that data, compare Relational (RDBMS) and Non-Relational (NoSQL) systems, install PostgreSQL, and write our very first SQL queries to create tables and insert data.

---

## 1. What is Data?

At its simplest, **Data** is a collection of raw facts, figures, observations, or measurements. 
* Examples: The number `100000`, the word `AMAN`, the string `SALES`, or the date `2026-05-30`.

By itself, raw data lacks context. However, when data is processed, structured, and organized, it becomes **Information**:
* *Information:* "Employee ID `1` is named `AMAN`, earns a salary of `100,000.00`, and works in the `SALES` department."

---

## 2. What is a Database?

A **Database** is an organized, structured collection of data stored electronically in a computer system. 

Instead of storing information in flat text files or spreadsheets (which become slow, duplicate data, and fail under multi-user access), databases use a **Database Management System (DBMS)**. The DBMS is software that controls how data is read, written, secured, and optimized.

---

## 3. RDBMS vs. Non-RDBMS (NoSQL)

Modern systems organize data using two primary models:

### A. RDBMS (Relational Database Management System)
An RDBMS organizes data into formal **tables** consisting of rows (tuples) and columns (attributes). Tables can be linked together using relationships (foreign keys). 
* **Key Features**: Strong ACID properties (Atomicity, Consistency, Isolation, Durability), strict schemas, and standard SQL queries.
* **Examples**: PostgreSQL, MySQL, SQLite, Oracle, Microsoft SQL Server.

### B. Non-RDBMS (NoSQL / Non-Relational)
Non-RDBMS systems store data in non-tabular formats. They are highly flexible and scale horizontally across many servers.
* **Storage Formats**:
  * *Document-based:* JSON objects (e.g., MongoDB).
  * *Key-Value:* Simple dictionaries (e.g., Redis).
  * *Columnar:* Sliced columns for large analytical scans (e.g., Cassandra).
  * *Graph:* Nodes and relationships (e.g., Neo4j).

---

## 4. Installing PostgreSQL (Step-by-Step)

PostgreSQL (or Postgres) is one of the most powerful, open-source object-relational databases in the world. Let's install it on your local machine:

### For Windows:
1. Go to the [Official EnterpriseDB Download Page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Download the installer for your version (e.g., PostgreSQL 15 or 16).
3. Run the installer and click Next.
4. **Important**: Set a password for the superuser account (`postgres`) and write it down.
5. Keep the default port as `5432` and complete the installation.
6. Open **pgAdmin** (installed automatically) to access your database visually.

### For macOS:
You can install PostgreSQL easily using **Homebrew** via your terminal:

```bash
# Install PostgreSQL
brew install postgresql@16

# Start the PostgreSQL background service
brew services start postgresql@16
```

Alternatively, you can download and run the one-click [Postgres.app graphical installer](https://postgresapp.com/).

### For Linux (Ubuntu/Debian):
Run these commands in your shell terminal:

```bash
# Update local packages
sudo apt update

# Install PostgreSQL and contrib modules
sudo apt install postgresql postgresql-contrib

# Start the service
sudo systemctl start postgresql
```

---

## 5. Writing Your First SQL Scripts

Once installed, open your command-line interface tool (such as **psql**) or pgAdmin Query Tool, and run these SQL commands:

### A. Creating a Database
Let's create a database called `mjsimplified_db` to hold our work:

```sql
CREATE DATABASE mjsimplified_db;
```
*(Switch to your newly created database in psql using `\c mjsimplified_db`)*

### B. Creating a Table
Let's define a structure for our employee records. We will create an `employee` table:

```sql
CREATE TABLE employee (
    emp_id INT,
    emp_name VARCHAR(100),
    emp_salary DECIMAL,
    emp_department VARCHAR(100)
);
```

**Understanding the Column Data Types:**
* `emp_id INT`: Stores integer IDs.
* `emp_name VARCHAR(100)`: Stores text up to 100 characters.
* `emp_salary DECIMAL`: Stores precise floating-point decimal numbers (ideal for financial salaries).
* `emp_department VARCHAR(100)`: Stores department name strings.

### C. Inserting Data
Now let's insert our first employee record:

```sql
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department) 
VALUES (1, 'AMAN', 100000.00, 'SALES');
```

If you want to insert multiple employees at once, you can extend the values list:

```sql
INSERT INTO employee (emp_id, emp_name, emp_salary, emp_department) 
VALUES 
  (2, 'PRIYA', 120000.00, 'ENGINEERING'),
  (3, 'VIKRAM', 95000.00, 'MARKETING');
```

### D. Selecting Data (Retrieval)
To fetch the records we just inserted, we use the `SELECT` statement:

```sql
-- Read all columns and rows from the employee table
SELECT * FROM employee;
```

**Query Output:**

| emp_id | emp_name | emp_salary | emp_department |
|---|---|---|---|
| 1 | AMAN | 100000.00 | SALES |
| 2 | PRIYA | 120000.00 | ENGINEERING |
| 3 | VIKRAM | 95000.00 | MARKETING |

If you only want to view the employee names and salaries, select those columns explicitly:

```sql
SELECT emp_name, emp_salary 
FROM employee;
```
---
Congratulations! You have set up PostgreSQL and executed your very first database queries. Next, we will explore deeper filtering and conditional selections.
