# 🍔 Food Delivery High-Performance API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

> **A robust, scalable backend system designed for strict data integrity under high concurrency.**

This project is a RESTful API built with **Node.js** and **Express**, following the **MVC architecture** and **SOLID principles**. It specifically addresses complex e-commerce challenges such as race conditions (overselling), deadlocks, and high-traffic performance optimization.

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** ExpressJS
- **Database:** MySQL (Relational)
- **Caching:** Redis
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose

---

## 🚀 Features

### 👤 User Capabilities
- **Authentication:** Secure Registration & Login (JWT).
- **Menu:** Browse food items with cached responses.
- **Ordering:**
  - Add items to cart.
  - Checkout/Place order.
  - **Track Order:** Real-time status updates (Pending, Shipping, etc.).
  - **Cancel Order:** Ability to cancel active orders.

### 🛡 Admin Capabilities
- **Product Management:** Add/Remove items, update prices.
- **User Management:** Manage user accounts and ban violators.

---

## 💎 Engineering Highlights (Performance & Security)

This section details the advanced patterns applied to ensure production readiness.

### 1. High Concurrency & Data Integrity
Addressed "Race Conditions" where multiple users attempt to purchase the last item simultaneously.

- **Pessimistic Locking:** Implemented Database Transactions with `SELECT ... FOR UPDATE`. This locks the product row during the transaction, strictly preventing **Overselling**.
- **Deadlock Prevention:** Eliminated system deadlocks during complex multi-item orders by enforcing a **Sorting Locking Order** strategy. Product IDs are always locked in ascending order to prevent circular dependency.

### 2. Performance Optimization & Scalability
- **Redis Cache-Aside Pattern:** Applied for the Menu/Product listing.
  - *Flow:* Check Cache -> Hit? Return -> Miss? Query DB -> Set Cache -> Return.
  - *Benefit:* Drastically reduced MySQL CPU usage and improved API latency.
- **Docker Containerization:** The entire stack is containerized for consistent deployment across environments.

### 3. Reliability & Security
- **Duplicate Submission Prevention:** Handled network latency issues using **Debouncing logic** and the **PRG Pattern** (Post/Redirect/Get) to prevent duplicate orders.
- **Security:**
  - **Rate Limiting:** Protects against brute-force/DDoS.
  - **SQL Injection Prevention:** Uses parameterized queries/ORM.
  - **RBAC:** Middleware-based Role-Based Access Control.
- **Testing:** Logic verified using **Jest**.

---

## 📊 System Visualizations

### Redis Cache-Aside Strategy
*How the system handles high-traffic menu viewing:*

