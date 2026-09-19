# Business Management & Inventory System

## Version 1 — Product & Technical Specification

**Project Status:** Planning
**Version:** 1.0
**Team:** 2 Developers
**Frontend:** Next.js
**Backend:** C# / ASP.NET Core
**AI Agent:** Python
**Database:** PostgreSQL

---

# 1. Project Overview

We are building a business management system that helps small businesses keep track of their **products, inventory, sales, revenue, and profit**.

The main problem we are trying to solve is poor business record keeping.

Many small business owners sell products every day but do not have a reliable way to answer simple questions such as:

* How much stock do I currently have?
* Which products are selling the most?
* How much did I sell today?
* How much profit did I make?
* Which products are running low?
* How has my business performed this month?
* How much stock did I add?
* Which products are contributing most to my revenue?

When these records are not properly maintained, business owners can lose money without knowing exactly where the problem is.

Our system will provide a central place for the business owner to record and monitor their business activity.

The system will also include an **AI business assistant** that allows the owner to ask questions about their business using natural language.

---

# 2. Product Goal

The goal of Version 1 is:

> **To give a business owner a clear view and better control of their inventory, sales, and business performance.**

The system should make it easy for a business owner to know:

**What do I have?**

→ Inventory

**What have I sold?**

→ Sales

**How much have I made?**

→ Revenue and profit

**How is my business performing?**

→ Business reports and performance metrics

**What should I pay attention to?**

→ AI business assistant

---

# 3. Target User

Version 1 is designed primarily for **small businesses that sell physical products**.

Examples include:

* Mini marts
* Cosmetics businesses
* Fashion businesses
* Phone/accessories businesses
* Small electronics businesses
* Grocery businesses
* Other product-based small businesses

We are not trying to support every type of business in Version 1.

The first version focuses on businesses where products are purchased, stocked, and sold.

---

# 4. Core Product Features

Version 1 will contain four major areas:

1. Product Management
2. Inventory Management
3. Sales Management
4. Business Dashboard & Reports

The fifth major component is:

5. AI Business Assistant

---

# 5. Product Management

A business owner should be able to manage the products they sell.

## Product information

Each product should contain information such as:

```text
Product
-------------------------
ID
Business ID
Name
SKU
Cost Price
Selling Price
Created At
Updated At
```

Example:

```text
Product: Coca-Cola 50cl
SKU: COKE-50
Cost Price: ₦300
Selling Price: ₦400
```

## Product actions

The owner should be able to:

* Add a product
* View products
* View a single product
* Edit a product
* Deactivate/delete a product

For Version 1, we should avoid unnecessarily complex product variations.

---

# 6. Inventory Management

Inventory represents the current stock available for each product.

The inventory table should represent the **current state** of stock.

Example:

```text
Inventory
-------------------------
Product ID
Quantity
Low Stock Threshold
Created At
Updated At
```

Example:

```text
Product: Coca-Cola 50cl
Current Quantity: 45
Low Stock Threshold: 10
```

This means the business currently has 45 units available.

If the quantity falls to or below 10, the product should be considered low stock.

---

# 7. Inventory Transactions

The inventory table tells us the current quantity.

The inventory transaction table tells us **how that quantity changed**.

This gives us an inventory history.

Example:

```text
Inventory Transaction
-------------------------
ID
Business ID
Product ID
Type
Quantity
Reference ID
Created At
```

Possible transaction types:

```text
STOCK_ADDITION
SALE
STOCK_ADJUSTMENT
```

Example history:

```text
Coca-Cola

+50  STOCK_ADDITION
-5   SALE
-3   SALE
+20  STOCK_ADDITION
-7   SALE
```

Current inventory:

```text
50 - 5 - 3 + 20 - 7 = 55
```

The current inventory table should contain:

```text
quantity = 55
```

while the transaction table preserves the history.

---

# 8. Important Inventory Rule

When inventory changes, the system should:

1. Create an inventory transaction.
2. Update the current inventory quantity.
3. Complete both operations successfully.

These operations should happen inside a **database transaction**.

We should never have a situation where:

```text
Inventory Transaction:
+50 stock added
```

but:

```text
Current Inventory:
quantity unchanged
```

The inventory history and current inventory must remain consistent.

---

# 9. Adding Stock

When a business owner receives new stock:

Example:

```text
Coca-Cola
Current stock: 20

Owner adds: 50
```

The system should:

```text
1. Create STOCK_ADDITION transaction
2. Increase inventory quantity
```

Result:

```text
Current stock: 70
```

The system should not simply overwrite the old quantity.

We need to preserve the history of the stock movement.

---

# 10. Sales Management

A business owner should be able to record sales.

A sale may contain one or more products.

Example:

```text
Sale
-------------------------
Coca-Cola x 5
Bread x 2
Milk x 3
```

The system should calculate:

```text
Total Sale Amount
```

and update inventory accordingly.

For example:

```text
Coca-Cola
Before: 50

Sold: 5

After: 45
```

The sale should also create an inventory transaction:

```text
Type: SALE
Quantity: -5
```

---

# 11. Sales Data

A sale should contain information such as:

```text
Sale
-------------------------
ID
Business ID
Total Amount
Created At
```

Individual products sold within that sale should be represented separately.

```text
Sale Item
-------------------------
ID
Sale ID
Product ID
Quantity
Unit Price
Cost Price
Subtotal
```

This allows one sale to contain multiple products.

---

# 12. Profit Calculation

The system should track enough information to calculate gross profit.

For each sale item:

```text
Revenue = Selling Price × Quantity

Cost = Cost Price × Quantity

Gross Profit = Revenue - Cost
```

Example:

```text
Product:
Coca-Cola

Selling Price: ₦400
Cost Price: ₦300

Quantity Sold: 10
```

Revenue:

```text
₦400 × 10 = ₦4,000
```

Cost:

```text
₦300 × 10 = ₦3,000
```

Gross Profit:

```text
₦4,000 - ₦3,000 = ₦1,000
```

Version 1 should report **gross profit**, not claim to calculate complete business profit after expenses, salaries, rent, tax, transportation, etc.

---

# 13. Dashboard

The dashboard should provide a quick overview of the business.

The exact UI is the frontend developer's responsibility, but the backend should provide the required data.

The dashboard should eventually show metrics such as:

```text
Today's Sales
Today's Gross Profit

Monthly Sales
Monthly Gross Profit

Total Products
Low Stock Products

Best Selling Products
Recent Sales
```

The goal is that the business owner can open the dashboard and understand the current state of the business quickly.

---

# 14. Reports

Version 1 should support basic business reports.

## Sales Report

The system should be able to answer:

* How much was sold today?
* How much was sold this week?
* How much was sold this month?
* Number of sales
* Total revenue

## Profit Report

The system should be able to calculate:

* Gross profit today
* Gross profit this week
* Gross profit this month

## Inventory Report

The system should provide:

* Current stock
* Low-stock products
* Stock additions
* Inventory movement

## Product Performance

The system should identify:

* Best-selling products
* Quantity sold per product
* Revenue generated per product
* Gross profit per product

---

# 15. AI Business Assistant

The AI assistant is one of the main features of the system.

The purpose of the AI is not simply to chat with the user.

The AI should help the business owner **understand and interact with their business data**.

Example:

```text
User:
What is my best selling product this month?

AI:
Your best-selling product this month is Coca-Cola 50cl.
You sold 184 units, generating ₦73,600 in revenue.
```

---

# 16. AI Read Operations

Initially, the AI should be able to answer questions such as:

### Product questions

```text
What is my best-selling product?

Which product sold the most this month?

How much Coca-Cola do I have left?

Which products are low on stock?
```

### Sales questions

```text
How much did I sell today?

How much did I sell this month?

How many sales did I make today?

Show me my sales report for this week.
```

### Profit questions

```text
How much profit did I make this month?

Which product generated the most profit?

What was my gross profit today?
```

### Business performance questions

```text
How is my business performing?

What changed this month?

Which products should I pay attention to?

What are the important things I should know about my business?
```

The AI should answer using actual business data retrieved from the backend.

---

# 17. AI Write Operations

The AI may eventually perform actions on behalf of the business owner.

Examples:

```text
Add 50 Coca-Cola to my stock.

Add 20 units of Milk.

Record a sale of 5 Coca-Cola.
```

However, write operations require additional safety.

For example:

```text
User:
Add 50 Coca-Cola to my stock.
```

The AI should first identify the product and operation.

It may respond:

```text
I found Coca-Cola 50cl.

Current stock: 20

Adding 50 units will increase your stock to 70.

Do you want me to proceed?
```

The operation should only be executed after confirmation.

---

# 18. AI Architecture

The Python AI agent should **not directly manipulate the database**.

The C# backend remains the main authority over business data and business rules.

Architecture:

```text
                    ┌─────────────────┐
                    │     React     │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   C# Backend    │
                    │  ASP.NET Core   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
                             ▲
                             │
                             │
                    ┌────────┴────────┐
                    │  Python AI      │
                    │     Agent       │
                    └─────────────────┘
```

The Python agent communicates with the backend through APIs.

---

# 19. AI Tools

The AI agent should have access to controlled tools.

Examples:

```text
get_product_stock()
get_best_selling_products()
get_sales_report()
get_profit_report()
get_low_stock_products()
get_business_performance()
add_stock()
record_sale()
```

The AI decides which tool is appropriate based on the user's request.

The actual business operation is handled by the C# backend.

This means:

```text
AI
 ↓
understands user request
 ↓
selects appropriate tool
 ↓
calls C# API
 ↓
C# validates request
 ↓
C# performs business operation
 ↓
database updated
 ↓
result returned to AI
 ↓
AI explains result to user
```

---

# 20. Multi-Tenant Business Structure

The system should be designed so that multiple businesses can use the platform.

A user owns or belongs to a business.

Example:

```text
User
 │
 └── Business
       │
       ├── Products
       ├── Inventory
       ├── Sales
       └── Reports
```

Every business-related record should be associated with the correct business.

A business owner must never be able to access another business's data.

This is a critical backend security requirement.

---

# 21. Initial Database Structure

The initial database may contain:

```text
users
businesses
products
inventory
inventory_transactions
sales
sale_items
```

Additional tables can be introduced when a real requirement appears.

We should avoid creating tables simply because we think we might need them someday.

---

# 22. Technology Responsibilities

## Frontend — React.js

The frontend developer is responsible for:

* Dashboard UI
* Product pages
* Inventory pages
* Sales pages
* Reports UI
* AI chat interface
* Forms
* Loading states
* Error states
* Responsive design
* Frontend API integration

The frontend should communicate with the C# backend rather than directly accessing the database.

---

## Backend — C# / ASP.NET Core

The backend developer is responsible for:

* API design
* Authentication
* Authorization
* Business logic
* Product management
* Inventory management
* Sales
* Profit calculations
* Reports
* Database access
* Validation
* Transactions
* Error handling
* Security
* AI API/tool endpoints

The C# backend is the **source of truth for business operations**.

---

## AI — Python

The AI developer is responsible for:

* AI agent
* Natural language understanding
* Tool/function calling
* Calling backend APIs
* Formatting business insights
* AI conversation flow
* Confirmation flow for write operations
* AI-related error handling

The AI should not bypass the backend.

---

# 23. API Responsibility

The backend should expose APIs that the frontend and AI agent can consume.

Examples:

```text
Products

GET    /api/products
GET    /api/products/{id}
POST   /api/products
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

```text
Inventory

GET    /api/inventory
GET    /api/inventory/{productId}
POST   /api/inventory/{productId}/add
GET    /api/inventory/{productId}/transactions
```

```text
Sales

POST   /api/sales
GET    /api/sales
GET    /api/sales/{id}
```

```text
Reports

GET    /api/reports/sales
GET    /api/reports/profit
GET    /api/reports/inventory
GET    /api/reports/products
GET    /api/reports/performance
```

The exact endpoint design may change during implementation.

The important thing is that the API should represent clear business operations.

---

# 24. Authentication & Authorization

Users must authenticate before accessing their business data.

Every protected request should identify the authenticated user.

The backend must verify that the user has permission to access the requested business/resource.

Example:

```text
User A
 ↓
Business A
 ↓
Products A
```

User A must not be able to request:

```text
Business B
Products B
Sales B
Inventory B
```

by simply changing an ID in the request.

Authorization must be enforced on the backend.

---

# 25. Important Business Rules

These rules must be enforced by the backend.

### Product

* Product belongs to a business.
* Product name is required.
* Selling price cannot be invalid.
* Cost price cannot be invalid.

### Inventory

* Inventory belongs to a product/business.
* Stock quantity cannot become negative.
* Stock additions must create inventory transactions.
* Sales must reduce inventory.
* Inventory changes must be recorded.

### Sales

* A sale must contain at least one product.
* Product must belong to the user's business.
* Quantity must be greater than zero.
* A sale cannot exceed available stock.
* Selling price used for the sale should be preserved in the sale item.
* Cost price used for the sale should be preserved for profit calculation.

### Security

* Users can only access authorized business data.
* AI requests must operate within the authenticated user's business.
* AI must not be able to access another business's data.

---

# 26. What Version 1 Will NOT Include

To keep the project simple and finishable, Version 1 will NOT focus on:

* Payroll
* Employee management
* Full accounting
* Tax management
* Invoicing
* Supplier management
* Customer relationship management
* Online payments
* E-commerce storefront
* Delivery management
* Advanced financial accounting
* Complex product variations
* Multiple warehouses
* Barcode hardware integration
* Mobile application
* Advanced forecasting
* Autonomous AI business decisions

These can be considered later if the core product proves useful.

---

# 27. Version 1 Success Criteria

Version 1 is successful when a business owner can:

```text
1. Create a business
        ↓
2. Add products
        ↓
3. Add stock
        ↓
4. View current inventory
        ↓
5. Record a sale
        ↓
6. Inventory automatically decreases
        ↓
7. View sales
        ↓
8. View revenue
        ↓
9. View gross profit
        ↓
10. Identify low-stock products
        ↓
11. Identify best-selling products
        ↓
12. Ask the AI questions about the business
        ↓
13. Receive answers based on actual business data
```

The system should work reliably through this complete flow before we start adding extra features.

---

# 28. Development Philosophy

We should prioritize:

### Correctness over features

A smaller system that correctly handles inventory and sales is better than a large system with unreliable business data.

### Business logic over UI complexity

The core system should accurately represent what is happening in the business.

### AI as an assistant, not the source of truth

The AI should use actual backend data.

It should never invent business numbers.

### Simple architecture

We should avoid unnecessary microservices, event buses, complicated infrastructure, and premature optimization.

The architecture should be understandable by both developers.

### Build incrementally

We should build and test one complete flow at a time.

For example:

```text
Product
   ↓
Inventory
   ↓
Sale
   ↓
Profit
   ↓
Report
   ↓
AI
```

---

# 29. Initial Development Order

We should build the system in this order:

## Phase 1 — Project foundation

* Repository setup
* Frontend setup
* C# backend setup
* Python agent setup
* Database setup
* Environment configuration
* Basic documentation

## Phase 2 — Authentication & business

* User registration/login
* Business creation
* Authorization

## Phase 3 — Products

* Product CRUD
* Product validation

## Phase 4 — Inventory

* Current inventory
* Stock addition
* Inventory transactions
* Low-stock detection

## Phase 5 — Sales

* Create sale
* Sale items
* Inventory deduction
* Sales history
* Profit calculation

## Phase 6 — Reports

* Sales report
* Profit report
* Inventory report
* Product performance

## Phase 7 — Dashboard

Frontend integrates the backend reports into the main dashboard.

## Phase 8 — AI Agent

Start with read-only AI capabilities:

```text
Best selling products
Current stock
Low stock
Sales report
Profit report
Business performance
```

## Phase 9 — AI Actions

Add controlled write operations:

```text
Add stock
Record sale
```

with confirmation and backend validation.

## Phase 10 — Testing & deployment

* Backend testing
* API testing
* Frontend integration testing
* AI testing
* Security testing
* Deployment
* Documentation

---

# 30. Definition of Done

A feature is not considered complete simply because the UI works.

A feature is complete when:

```text
Frontend
   ↓
API
   ↓
Business Logic
   ↓
Database
   ↓
Validation
   ↓
Error Handling
   ↓
Testing
```

all work correctly.

For example, "Add Stock" is complete only when:

* User can access the feature.
* User can select a product.
* User can enter quantity.
* Frontend sends the request.
* Backend authenticates the user.
* Backend verifies product ownership.
* Backend validates quantity.
* Backend creates the inventory transaction.
* Backend updates current inventory.
* Both operations occur atomically.
* Updated stock is returned.
* Errors are handled properly.
* The action can be verified in inventory history.

---

# 31. Final Product Vision

Version 1 is not trying to become a complete ERP or accounting platform.

The first goal is much simpler:

> **Help a small business owner understand what they have, what they sell, how much they are making, and what needs their attention.**

The AI assistant then makes this information easier to access by allowing the owner to interact with their business data naturally.

The foundation is:

```text
                    BUSINESS
                       │
          ┌────────────┼────────────┐
          │            │            │
       PRODUCTS     INVENTORY      SALES
          │            │            │
          └────────────┼────────────┘
                       │
                  BUSINESS DATA
                       │
            ┌──────────┴──────────┐
            │                     │
        DASHBOARD              AI AGENT
            │                     │
            └──────────┬──────────┘
                       │
                BUSINESS INSIGHTS
```

The most important principle throughout the project is:

> **The system should help the business owner understand their business through reliable data, not just provide another place to enter data.**
