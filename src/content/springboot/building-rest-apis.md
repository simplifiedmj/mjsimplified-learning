---
title: "Building Scalable REST APIs with Spring Boot"
slug: "building-rest-apis"
category: "springboot"
description: "A comprehensive guide to creating RESTful web services using Spring Boot, Hibernate/JPA, and Maven. Includes best practices for controllers, services, and repositories."
date: "2026-05-10"
thumbnail: "/images/tutorials/spring-boot-rest.jpg"
tags: ["Spring Boot", "Java", "REST API", "JPA", "Backend Development"]
author: "MJSimplified"
---

Spring Boot has become the industry standard framework for building production-grade enterprise Java applications. Its "opinionated" configuration model eliminates boilerplate code, allowing developers to focus entirely on writing business logic.

In this tutorial, we will build a clean, layered REST API from scratch using Spring Boot 3.x, Spring Data JPA, and PostgreSQL.

## 1. Project Architecture

For a scalable enterprise application, it's best to follow a **Layered Architecture**:

1. **Controller Layer**: Handles incoming HTTP requests, maps URLs, and returns HTTP responses.
2. **Service Layer**: Contains business logic, manages transactions, and orchestrates actions between components.
3. **Repository Layer**: Interface to database operations, powered by Spring Data JPA.
4. **Model/Entity Layer**: Represents tables in the database.

## 2. Setting Up the Entity

Let's build a REST API for managing a list of `Product` entities. First, we define our domain model:

```java
package com.mjsimplified.learning.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    // Constructors
    public Product() {}

    public Product(String name, String description, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
```

## 3. Creating the Repository

Thanks to **Spring Data JPA**, we do not need to write database queries manually for CRUD operations. We simply extend `JpaRepository`:

```java
package com.mjsimplified.learning.repository;

import com.mjsimplified.learning.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring will automatically generate query implementations for standard CRUD
}
```

## 4. Implementing the Service Layer

The Service layer is where your business rules reside. It separates the web layer from the database layer.

```java
package com.mjsimplified.learning.service;

import com.mjsimplified.learning.model.Product;
import com.mjsimplified.learning.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```

## 5. Exposing the Rest Controller

Now we expose our endpoints to the web. We use `@RestController` and map HTTP methods (`GET`, `POST`, `DELETE`, etc.) to controller methods:

```java
package com.mjsimplified.learning.controller;

import com.mjsimplified.learning.model.Product;
import com.mjsimplified.learning.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 6. Running and Testing the API

To run this application, add database credentials inside `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mjsimplified_db
spring.datasource.username=postgres
spring.datasource.password=secretpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Fire up your application by running the main method annotated with `@SpringBootApplication` and test the endpoint with a `curl` call:

```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Developer Keyboard", "description": "Mechanical switches", "price": 129.99}'
```
