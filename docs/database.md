# Business Management Database

The database is designed to support the core operations of a business management system, including user management, business management, product management, sales, inventory management, and inventory transactions.

## Database Tables

1. **Users**
2. **Businesses**
3. **Products**
4. **Sales**
5. **Inventory**
6. **Inventory Transactions**

---

## 1. Users Table

### Responsibility

The `Users` table stores information about users who have accounts on the system. A user can own or manage one or more businesses.

### Columns

| Column       | Type        | Constraints             |
| ------------ | ----------- | ----------------------- |
| `id`         | UUID        | PRIMARY KEY, NOT NULL   |
| `name`       | TEXT        | NOT NULL                |
| `email`      | TEXT        | NOT NULL, UNIQUE        |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `verified`   | BOOLEAN     | NOT NULL, DEFAULT FALSE |

### Relationships

* A `User` can own one or more `Businesses`.
* `Businesses.user_id` references `Users.id`.

---

## 2. Businesses Table

### Responsibility

The `Businesses` table stores information about businesses registered by users. It identifies which user owns each business and stores basic business information.

### Columns

| Column              | Type | Constraints           |
| ------------------- | ---- | --------------------- |
| `id`                | UUID | PRIMARY KEY, NOT NULL |
| `user_id`           | UUID | NOT NULL, FOREIGN KEY |
| `business_name`     | TEXT | NOT NULL              |
| `business_category` | TEXT | NOT NULL              |

### Relationships

* Each `Business` belongs to a `User`.
* A `Business` can have multiple `Products`.
* A `Business` can have multiple `Sales`.
* A `Business` can have inventory records.

**Foreign Key:**

`Businesses.user_id → Users.id`

---

## 3. Products Table

### Responsibility

The `Products` table stores the products that a business sells. It contains product identification, pricing, and ownership information.

### Columns

| Column          | Type        | Constraints             |
| --------------- | ----------- | ----------------------- |
| `id`            | BIGSERIAL   | PRIMARY KEY             |
| `business_id`   | UUID        | NOT NULL, FOREIGN KEY   |
| `name`          | TEXT        | NOT NULL                |
| `sku`           | TEXT        | NOT NULL                |
| `cost_price`    | NUMERIC     | NOT NULL                |
| `selling_price` | NUMERIC     | NOT NULL                |
| `created_at`    | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at`    | TIMESTAMPTZ | NULLABLE                |

### Relationships

* Each `Product` belongs to one `Business`.
* A `Product` can appear in multiple sales.
* A `Product` can have inventory transactions.

**Foreign Key:**

`Products.business_id → Businesses.id`

---

## 4. Sales Table

### Responsibility

The `Sales` table records completed sales made by a business. It stores information about the transaction, including which business made the sale and the total amount.

### Suggested Columns

| Column         | Type        | Constraints             |
| -------------- | ----------- | ----------------------- |
| `id`           | UUID        | PRIMARY KEY             |
| `business_id`  | UUID        | NOT NULL, FOREIGN KEY   |
| `total_amount` | NUMERIC     | NOT NULL                |
| `created_at`   | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### Relationships

* Each `Sale` belongs to a `Business`.
* A sale can contain one or more products.

**Important:** If one sale can contain multiple products, you should eventually introduce a `Sale_Items` table rather than putting a single `product_id` directly in `Sales`.

---

## 5. Inventory Table

### Responsibility

The `Inventory` table represents the current stock level of products belonging to a business. It allows the system to know how many units of each product are currently available.

### Suggested Columns

| Column        | Type        | Constraints             |
| ------------- | ----------- | ----------------------- |
| `id`          | UUID        | PRIMARY KEY             |
| `business_id` | UUID        | NOT NULL, FOREIGN KEY   |
| `product_id`  | BIGINT      | NOT NULL, FOREIGN KEY   |
| `quantity`    | INTEGER     | NOT NULL, DEFAULT 0     |
| `updated_at`  | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### Relationships

* Each inventory record belongs to a `Business`.
* Each inventory record belongs to a `Product`.
* Inventory changes are recorded in `Inventory Transactions`.

---

## 6. Inventory Transactions Table

### Responsibility

The `Inventory Transactions` table records every change made to a product's inventory. It provides an audit trail showing why and when stock changed.

Examples of transactions include:

* Stock received from a supplier
* Product sold
* Damaged product
* Returned product
* Manual stock adjustment

### Suggested Columns

| Column             | Type        | Constraints             |
| ------------------ | ----------- | ----------------------- |
| `id`               | UUID        | PRIMARY KEY             |
| `business_id`      | UUID        | NOT NULL, FOREIGN KEY   |
| `product_id`       | BIGINT      | NOT NULL, FOREIGN KEY   |
| `transaction_type` | TEXT        | NOT NULL                |
| `quantity`         | INTEGER     | NOT NULL                |
| `created_at`       | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### Relationships

* Each transaction belongs to a `Business`.
* Each transaction belongs to a `Product`.
* Multiple transactions can belong to the same product.

---

# Overall Relationships

```text
Users
  │
  │ 1:N
  ▼
Businesses
  │
  ├────────── 1:N ──────────► Products
  │                              │
  │                              │ 1:N
  │                              ▼
  │                     Inventory Transactions
  │
  ├────────── 1:1/N ─────────► Inventory
  │
  └────────── 1:N ───────────► Sales
```

### Main Responsibilities

| Table                    | Responsibility                     |
| ------------------------ | ---------------------------------- |
| `Users`                  | Stores system users                |
| `Businesses`             | Stores businesses owned by users   |
| `Products`               | Stores products sold by businesses |
| `Sales`                  | Records completed sales            |
| `Inventory`              | Maintains the current stock level  |
| `Inventory Transactions` | Records every change to inventory  |

### Important Design Principle

`Inventory` and `Inventory Transactions` have different responsibilities.

**Inventory answers:**

> "How much stock do we currently have?"

**Inventory Transactions answers:**

> "What happened to the stock, and why did it change?"

This separation is useful because the inventory table represents the **current state**, while inventory transactions provide the **history of changes**.
