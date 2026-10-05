# Sales Management

## Overview

The Sales Management feature allows a business to record products sold, track customer payments, and manage outstanding debts.

A **sale represents the complete transaction**, while a **debit represents the unpaid portion of that transaction**.

The system supports both fully paid and partially/unpaid sales.

---

## Sales Flow

When creating a sale, the user:

1. Selects the products and quantities.
2. The system calculates the total using the products' current selling prices.
3. Optionally provides the customer's name and phone number.
4. Provides the amount paid.
5. The system calculates the outstanding amount.

Example:

```text
Products:       ₦20,000
Amount paid:    ₦15,000
Outstanding:     ₦5,000
```

If the customer pays the full amount, no debit is created.

If the customer pays partially or nothing, a debit is created for the outstanding amount.

Customer name and phone number are optional for normal sales but required when a debit is created.

---

## Product-Specific Debt

A business may also want to identify exactly which products have not been paid for.

For example:

```text
Rice × 2       ₦10,000    Paid
Oil × 2         ₦5,000    Unpaid
Drinks × 5      ₦5,000    Paid
```

The sale still contains **all products purchased**, while `DebitItems` can identify the unpaid products.

The system also supports a general outstanding balance where the business does not associate the debt with specific products.

Therefore, `DebitItems` is optional.

---

## Database Structure

```text
Businesses
    │
    └── Sales
          │
          ├── SaleItems
          │
          └── Debits
                │
                ├── DebitItems
                │
                └── Payments
```

### Sales

Stores the overall transaction.

```text
id
business_id
customer_name
customer_phone
total_amount
amount_paid
status
created_at
```

### SaleItems

Stores every product purchased in the sale.

```text
id
sale_id
product_id
quantity
unit_price
total_price
```

The unit price is stored so historical sales remain accurate even if the product price changes later.

### Debits

Stores the outstanding amount from a sale.

```text
id
sale_id
amount_due
amount_paid
created_at
updated_at
```

### DebitItems

Optionally identifies the specific products that make up the debt.

```text
id
debit_id
sale_item_id
quantity
amount
```

### Payments

Stores payments made toward an outstanding debit, allowing the system to maintain payment history.

```text
id
debit_id
amount
created_at
```

---

## Integration With Inventory

A successful sale reduces the quantity of the sold products from inventory.

Sale creation and inventory updates should happen within the same database transaction so that the system does not create a sale without updating inventory, or update inventory without creating the sale.

---

## Integration With the Dashboard

Sales data provides the dashboard with information such as:

* Total sales
* Amount collected
* Outstanding debts
* Number of sales
* Recent sales
* Best-selling products

The dashboard should distinguish between **sales value** and **money actually collected**, since a business can sell ₦20,000 worth of products while collecting only ₦15,000.

---

## AI Integration

The AI agent is another way of performing the same sales operations available through the manual interface.

For example:

> "I sold Musa two bags of rice and three bottles of oil. He paid ₦15,000."

The AI identifies the products, customer, and payment amount, then uses the sales operation provided by the backend.

```text
Manual UI ──────┐
                ├──> Sales Service ──> Database
AI Agent ───────┘
```

The AI does not implement separate sales logic or directly modify the database. It uses the same backend business logic as the manual interface.

The backend remains responsible for validation, pricing, authorization, inventory updates, debit creation, and database transactions.

---

## Core Principle

The Sales Management system follows three main concepts:

**Sale** → What the customer purchased.

**Debit** → What the customer still owes.

**Payment** → Money paid toward the outstanding debt.

This structure allows the system to support both simple cash sales and real-world credit/partial-payment transactions while keeping sales, inventory, and financial records consistent.
