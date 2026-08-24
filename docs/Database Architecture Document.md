# Database Architecture Document

## 1. Database Overview

Campus Exchange will use MySQL as its relational database.

The database is designed for a simple single-university educational marketplace.

Core relationships:

```text
Users
  ├── Products
  ├── Favorites
  ├── Requests
  ├── Conversations
  ├── Messages
  └── Reports

Categories
  └── Products

Products
  ├── Requests
  ├── Favorites
  ├── Conversations
  └── Reports
```

No multi-vendor, subscription, payment, or enterprise database structures are required.

---

## 2. Core Entities

The main entities are:

1. Users
2. Categories
3. Products
4. Favorites
5. Purchase Requests
6. Conversations
7. Messages
8. Reports

---

## 3. Users Table

Stores students and Admin accounts.

### Fields

| Field               | Type      | Description                 |
| ------------------- | --------- | --------------------------- |
| id                  | BIGINT    | Primary key                 |
| name                | VARCHAR   | Student/Admin name          |
| email               | VARCHAR   | University email            |
| password            | VARCHAR   | Hashed password             |
| role                | ENUM      | student/admin               |
| email_verified_at   | TIMESTAMP | Verification timestamp      |
| contact_information | VARCHAR   | Contact details             |
| profile_image       | VARCHAR   | Optional profile image path |
| status              | ENUM      | active/blocked              |
| created_at          | TIMESTAMP | Creation time               |
| updated_at          | TIMESTAMP | Last update                 |

### Rules

* Email must be unique.
* Role defaults to `student` during normal registration.
* Admin accounts must not be created through public registration.
* Blocked users cannot perform normal marketplace operations.

---

## 4. Categories Table

Stores Admin-controlled product categories.

### Fields

| Field      | Type      | Description   |
| ---------- | --------- | ------------- |
| id         | BIGINT    | Primary key   |
| name       | VARCHAR   | Category name |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update   |

### Rules

* Category name must be unique.
* Only Admin can create, update, or delete categories.

---

## 5. Products Table

Stores student marketplace listings.

### Fields

| Field               | Type         | Description         |
| ------------------- | ------------ | ------------------- |
| id                  | BIGINT       | Primary key         |
| user_id             | BIGINT       | Seller              |
| category_id         | BIGINT       | Product category    |
| name                | VARCHAR      | Product name        |
| description         | TEXT         | Product description |
| price               | DECIMAL      | Product price       |
| condition           | VARCHAR/ENUM | Product condition   |
| image               | VARCHAR      | Image path          |
| location            | VARCHAR      | Campus/location     |
| contact_information | VARCHAR      | Seller contact      |
| status              | ENUM         | available/sold      |
| created_at          | TIMESTAMP    | Creation time       |
| updated_at          | TIMESTAMP    | Last update         |

### Relationships

```text
User 1 ──── * Products
Category 1 ──── * Products
```

### Rules

* Every product belongs to one student.
* Every product belongs to one category.
* Product status starts as `available`.
* Only the owner or Admin can modify/delete the product.

---

## 6. Favorites Table

Stores saved products.

### Fields

| Field      | Type      | Description   |
| ---------- | --------- | ------------- |
| id         | BIGINT    | Primary key   |
| user_id    | BIGINT    | Student       |
| product_id | BIGINT    | Saved product |
| created_at | TIMESTAMP | Save time     |

### Relationships

```text
User 1 ──── * Favorites
Product 1 ──── * Favorites
```

### Constraint

A student cannot save the same product more than once.

Recommended unique constraint:

```text
UNIQUE(user_id, product_id)
```

---

## 7. Purchase Requests Table

Stores requests made by students to purchase products.

### Fields

| Field      | Type      | Description               |
| ---------- | --------- | ------------------------- |
| id         | BIGINT    | Primary key               |
| product_id | BIGINT    | Requested product         |
| buyer_id   | BIGINT    | Requesting student        |
| seller_id  | BIGINT    | Product owner             |
| status     | ENUM      | pending/accepted/rejected |
| created_at | TIMESTAMP | Request time              |
| updated_at | TIMESTAMP | Last update               |

### Relationships

```text
Product 1 ──── * Requests
Buyer(User) 1 ──── * Requests
Seller(User) 1 ──── * Requests
```

### Rules

* Buyer cannot request their own product.
* Only Available products can receive requests.
* Duplicate active requests should not be allowed.
* Seller can accept or reject the request.
* Accepted request changes the product to `sold`.

---

## 8. Conversations Table

Stores one-to-one conversations.

### Fields

| Field       | Type      | Description                         |
| ----------- | --------- | ----------------------------------- |
| id          | BIGINT    | Primary key                         |
| product_id  | BIGINT    | Related product, nullable if needed |
| user_one_id | BIGINT    | First participant                   |
| user_two_id | BIGINT    | Second participant                  |
| created_at  | TIMESTAMP | Creation time                       |
| updated_at  | TIMESTAMP | Last activity                       |

### Relationships

```text
Product 1 ──── * Conversations
User 1 ──── * Conversations
User 1 ──── * Conversations
```

A conversation should have two participants.

---

## 9. Messages Table

Stores messages belonging to conversations.

### Fields

| Field           | Type      | Description     |
| --------------- | --------- | --------------- |
| id              | BIGINT    | Primary key     |
| conversation_id | BIGINT    | Conversation    |
| sender_id       | BIGINT    | Message sender  |
| message         | TEXT      | Message content |
| created_at      | TIMESTAMP | Sent time       |
| updated_at      | TIMESTAMP | Update time     |

### Relationships

```text
Conversation 1 ──── * Messages
User 1 ──── * Messages
```

### Rules

* Sender must belong to the conversation.
* Message cannot be empty.
* Users cannot access conversations they do not participate in.

---

## 10. Reports Table

Stores reports submitted by students.

### Fields

| Field            | Type      | Description                |
| ---------------- | --------- | -------------------------- |
| id               | BIGINT    | Primary key                |
| reporter_id      | BIGINT    | User creating report       |
| reported_user_id | BIGINT    | Reported user, nullable    |
| product_id       | BIGINT    | Reported product, nullable |
| reason           | VARCHAR   | Report reason              |
| description      | TEXT      | Additional information     |
| status           | ENUM      | pending/resolved           |
| created_at       | TIMESTAMP | Report time                |
| updated_at       | TIMESTAMP | Last update                |

A report can target either:

* A user
* A product

The database should ensure that at least one target exists.

---

## 11. Relationship Map

```text
                    USERS
                      |
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
     PRODUCTS      FAVORITES     REQUESTS
        |             |          ↙       ↘
        ↓             ↓       BUYER      SELLER
   CATEGORIES       USER          \       /
                                  PRODUCTS
                                     |
                                     ↓
                              CONVERSATIONS
                                ↙        ↘
                             USERS      MESSAGES
                                         ↓
                                        USER

USERS
  ↓
REPORTS
  ↓
PRODUCTS / USERS
```

---

## 12. Foreign Key Relationships

Recommended relationships:

| Child Table   | Foreign Key      | Parent           |
| ------------- | ---------------- | ---------------- |
| products      | user_id          | users.id         |
| products      | category_id      | categories.id    |
| favorites     | user_id          | users.id         |
| favorites     | product_id       | products.id      |
| requests      | product_id       | products.id      |
| requests      | buyer_id         | users.id         |
| requests      | seller_id        | users.id         |
| conversations | product_id       | products.id      |
| conversations | user_one_id      | users.id         |
| conversations | user_two_id      | users.id         |
| messages      | conversation_id  | conversations.id |
| messages      | sender_id        | users.id         |
| reports       | reporter_id      | users.id         |
| reports       | reported_user_id | users.id         |
| reports       | product_id       | products.id      |

---

## 13. Indexing Strategy

Because this is a small educational project, indexing should remain simple.

Recommended indexes:

### Users

* `email`
* `role`
* `status`

### Products

* `user_id`
* `category_id`
* `status`
* `price`
* `location`
* `created_at`

### Favorites

* `user_id`
* `product_id`
* unique `(user_id, product_id)`

### Requests

* `product_id`
* `buyer_id`
* `seller_id`
* `status`

### Conversations

* `user_one_id`
* `user_two_id`
* `product_id`

### Messages

* `conversation_id`
* `sender_id`
* `created_at`

### Reports

* `reporter_id`
* `reported_user_id`
* `product_id`
* `status`

---

## 14. Database Constraints

The database should enforce important integrity rules where practical.

Examples:

```text
users.email UNIQUE

categories.name UNIQUE

favorites(user_id, product_id) UNIQUE
```

Foreign keys should be used to prevent invalid relationships.

---

## 15. Soft Delete Strategy

Soft deletion can be used where historical relationships are useful.

Recommended:

* Users
* Products

Laravel's `SoftDeletes` can be used for these entities if required.

For an educational implementation, soft deletion should only be introduced where it makes the application behavior clearer.

Categories, favorites, messages, and requests do not require unnecessary soft-delete complexity.

---

## 16. Product Deletion Handling

When a product is deleted:

* It should no longer appear in marketplace browsing.
* New purchase requests must be blocked.
* Associated favorites should be removed or handled safely.
* Existing requests should not cause database integrity errors.
* Related conversations can either remain for historical purposes or be handled according to the final implementation.

The chosen behavior must be consistent throughout the application.

---

## 17. User Deletion Handling

User deletion requires care because a user may have:

* Products
* Favorites
* Requests
* Conversations
* Messages
* Reports

The application should prevent orphaned records.

For the educational project, a soft-delete approach for users is preferable if it simplifies relationship preservation.

---

## 18. Transaction Requirements

Database transactions should be used for operations that modify multiple related records.

Most importantly:

### Accept Purchase Request

```text
BEGIN TRANSACTION

1. Verify request is Pending
2. Verify product is Available
3. Change request to Accepted
4. Change product to Sold
5. Reject/disable other active requests

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

This prevents a situation where the request becomes accepted but the product remains available.

---

## 19. Database State Model

## Product

```text
AVAILABLE
    ↓
  SOLD
```

## Request

```text
PENDING
  ├── ACCEPTED
  └── REJECTED
```

## Report

```text
PENDING
   ↓
RESOLVED
```

## User

```text
ACTIVE
  ↓
BLOCKED
```

Deletion is handled separately.

---

## 20. Data Validation Rules

## User

* Valid university email.
* Unique email.
* Valid password.
* Required name.

## Product

* Required name.
* Required description.
* Valid price.
* Valid category.
* Valid condition.
* Valid image.
* Required location.
* Required contact information.

## Favorite

* Valid user.
* Valid product.
* No duplicate relationship.

## Request

* Valid buyer.
* Valid seller.
* Valid product.
* Buyer and seller cannot be the same.
* Product must be Available.
* No duplicate active request.

## Message

* Valid conversation.
* Valid sender.
* Sender must be participant.
* Message cannot be empty.

## Report

* Valid reporter.
* Valid target.
* Reason required.
* Report target must exist.

---

## 21. Data Retention

Since this is a local educational project, no complex retention policy is required.

Data remains stored until:

* User deletes their account.
* Admin deletes content.
* Developer resets the local database.

No legal or commercial retention system is required.

---

## 22. Backup Strategy

For local development:

* MySQL database can be exported manually.
* Laravel migrations provide schema recreation.
* Seeders provide demonstration data.

No automated cloud backup infrastructure is required.

---

## 23. Database Seeder Requirements

The project should include sample data for demonstration.

Recommended seed data:

### Users

* 1 Admin
* 5 to 10 Students

### Categories

Examples:

* Books
* Electronics
* Clothing
* Furniture
* Accessories
* Academic Materials

### Products

Create multiple products across categories.

### Requests

Create sample pending, accepted, and rejected requests where appropriate.

### Messages

Create sample conversations and message history.

### Reports

Create a small number of sample reports.

This will make classroom demonstrations easier.

---

## 24. Database Architecture Boundary

The database intentionally does not include:

* Payments
* Transactions for real money
* Subscriptions
* Vendors
* Shops
* Commissions
* Delivery systems
* Inventory warehouses
* Coupons
* Tax systems
* Complex notification tables
* AI recommendation data
* Analytics warehouse
* Multi-tenant structures

These are outside the educational project scope.

---

## 25. Recommended Final Table Set

The initial database should contain:

```text
users
categories
products
favorites
purchase_requests
conversations
messages
reports
```

Laravel's standard authentication-related tables may also be included where needed, such as password reset or session-related tables depending on the chosen authentication implementation.

This table set is sufficient to support the finalized Campus Exchange requirements without unnecessary database complexity.
