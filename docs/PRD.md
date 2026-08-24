# PRD — Campus Exchange

## 1. Product Overview

Campus Exchange is an educational student marketplace for a single university.

The platform allows verified university students to list products, browse available products, search and filter listings, save favorites, communicate with sellers, and submit purchase requests.

An Admin manages users, products, categories, reports, and basic system statistics.

The project is intended for academic demonstration and local development. It is not designed as a production commercial marketplace.

The original project plan defines Campus Exchange as a “Student Marketplace & Real-Time Communication Platform” with React UI, authentication, CRUD operations, product listings, search/filter, messaging, order/request handling, and Admin management. 

---

## 2. Product Goals

The primary goals are:

1. Build a complete full-stack educational web application.
2. Connect a React TypeScript frontend with a Laravel REST API.
3. Store application data using MySQL.
4. Demonstrate authentication and email verification.
5. Demonstrate CRUD operations.
6. Demonstrate relational database design.
7. Provide a simple student marketplace.
8. Provide basic student-to-student communication.
9. Provide role-based Admin functionality.
10. Create a project that can be demonstrated locally.

---

## 3. Target Users

### Student

University students who want to:

* Sell products.
* Find products.
* Contact sellers.
* Request products.
* Save products.
* Manage their own listings.

### Admin

The system administrator responsible for:

* Managing users.
* Managing products.
* Managing categories.
* Reviewing reports.
* Removing inappropriate content.
* Viewing basic statistics.

There is no multi-vendor role.

---

## 4. Core User Problems

Students may have unused:

* Books
* Electronics
* Clothing
* Furniture
* Accessories
* Academic materials

They need a simple university-focused place to:

* Discover products from other students.
* Contact sellers.
* Request products.
* Manage their own listings.

Campus Exchange provides this functionality within one university community.

---

## 5. Product Scope

## Included

* Student registration.
* University email verification.
* Login/logout.
* Student profiles.
* Product listings.
* Product images.
* Categories.
* Search.
* Filtering.
* Sorting.
* Favorites.
* Purchase requests.
* Accept/reject workflow.
* Product sold status.
* Conversations.
* Message history.
* Product/user reporting.
* Admin user management.
* Admin product management.
* Admin category management.
* Admin report management.
* Basic Admin analytics.

## Excluded

* Real payment.
* Payment gateway.
* Subscription.
* Multi-vendor marketplace.
* Delivery management.
* Commission system.
* AI recommendation.
* Location API.
* Complex real-time infrastructure.
* Advanced notification system.
* Enterprise scalability.

---

## 6. User Journey

## 6.1 Student Registration

```text
Open Campus Exchange
        ↓
Register
        ↓
Enter University Email
        ↓
Verify Email
        ↓
Login
        ↓
Student Dashboard
```

---

## 6.2 Selling a Product

```text
Student Login
      ↓
Create Listing
      ↓
Enter Product Information
      ↓
Upload Image
      ↓
Submit
      ↓
Product Available
```

---

## 6.3 Finding a Product

```text
Browse Marketplace
       ↓
Search
       ↓
Filter
       ↓
Sort
       ↓
View Product
       ↓
Save / Message / Request
```

---

## 6.4 Purchase Request

```text
Buyer
  ↓
View Available Product
  ↓
Request to Buy
  ↓
Seller Reviews Request
  ↓
Accept / Reject
```

If accepted:

```text
Request = Accepted
Product = Sold
```

If rejected:

```text
Request = Rejected
Product = Available
```

---

## 7. Functional Requirements

## FR-01 Authentication

The system shall allow students to register using their university email.

The system shall require email verification before marketplace access.

The system shall allow users to log in and log out.

The system shall prevent unauthorized users from accessing protected resources.

---

## FR-02 Student Profile

Students shall be able to view and update their own profile.

The profile shall contain basic student information.

---

## FR-03 Product Listing

Students shall be able to:

* Create products.
* View products.
* Edit their products.
* Delete their products.
* Mark products as sold through the request workflow.

Each product shall contain the required product information defined in the Functional Specification Document.

---

## FR-04 Categories

The Admin shall control categories.

Students shall select from existing categories when creating products.

Students shall not create or modify categories.

---

## FR-05 Search and Filtering

Students shall be able to search products.

Students shall be able to filter by:

* Category.
* Price.
* Condition.
* Location.

Students shall be able to sort products.

---

## FR-06 Favorites

Students shall be able to:

* Save a product.
* Unsave a product.
* View saved products.

A student cannot save the same product multiple times.

---

## FR-07 Purchase Requests

Students shall be able to request an Available product.

A student cannot request their own product.

Sellers shall be able to accept or reject requests.

An accepted request shall make the product Sold.

---

## FR-08 Messaging

Students shall be able to create conversations related to marketplace interactions.

Students shall be able to:

* View conversations.
* Send messages.
* View message history.

A student cannot access another student's private conversations.

---

## FR-09 Reporting

Students shall be able to report:

* Products.
* Users.

Admin shall be able to review reports and take appropriate action.

---

## FR-10 Administration

Admin shall be able to:

* View users.
* Block users.
* Delete users.
* View products.
* Delete products.
* Manage categories.
* Review reports.
* Remove spam listings.
* View basic statistics.

---

## 8. Dashboard Requirements

## Student Dashboard

The dashboard shall provide:

* My Listings.
* My Requests.
* Received Requests.
* Favorites.
* Messages.
* Profile.

## Admin Dashboard

The dashboard shall display:

* Total users.
* Total products.
* Available products.
* Sold products.
* Total requests.
* Total reports.
* Total categories.

---

## 9. Product Categories

The system should support common university marketplace categories.

Initial examples:

* Books.
* Electronics.
* Clothing.
* Furniture.
* Accessories.
* Academic Materials.
* Others.

Only Admin can control the final category list.

---

## 10. Product Status

Products use:

```text
Available
Sold
```

Default:

`Available`

When a seller accepts a purchase request:

`Available → Sold`

Sold products cannot receive new purchase requests.

---

## 11. Purchase Request Status

Requests use:

```text
Pending
Accepted
Rejected
```

Workflow:

```text
Pending
 ├── Accepted
 └── Rejected
```

---

## 12. Reporting Status

Reports use:

```text
Pending
Resolved
```

---

## 13. Success Criteria

The project will be considered successful when the following workflows work correctly:

* Student registration.
* University email verification.
* Login/logout.
* Product creation.
* Product editing.
* Product deletion.
* Product browsing.
* Search.
* Filtering.
* Sorting.
* Favorites.
* Purchase request.
* Seller acceptance/rejection.
* Product status update.
* Conversations.
* Message history.
* Product/user reporting.
* Admin user management.
* Admin product management.
* Admin category management.
* Admin report management.
* Basic statistics.

---

## 14. Academic Success Metrics

Because this is an educational project, success is measured by functionality rather than commercial KPIs.

The project should demonstrate:

* React + TypeScript knowledge.
* Laravel backend development.
* REST API implementation.
* MySQL relational database design.
* Authentication.
* Authorization.
* CRUD operations.
* Form validation.
* API integration.
* Database relationships.
* Responsive frontend development.
* Basic software testing.

---

## 15. Technical Product Boundary

The PRD assumes:

```text
Frontend
React + TypeScript

Backend
Laravel

Database
MySQL

Communication
REST API

Authentication
Laravel authentication / Sanctum

Storage
Local Laravel file storage
```

The original AI Website Building Guide emphasizes that the PRD defines what the website does and who it serves, while the Design Document defines visual behavior and the Tech Stack Document defines implementation technologies. 

---

## 16. MVP Definition

The complete academic MVP consists of:

### Authentication

* Registration.
* University email verification.
* Login.
* Logout.

### Marketplace

* Product creation.
* Product browsing.
* Product details.
* Search.
* Filtering.
* Sorting.

### Student Features

* Profile.
* Favorites.
* Purchase requests.
* Messaging.
* Reporting.

### Admin Features

* User management.
* Product management.
* Category management.
* Report management.
* Basic analytics.

This is the intended final academic scope.

---

## 17. Out-of-Scope Features

The following must not be added unless the project requirements change:

* Real payment processing.
* Online checkout.
* Delivery tracking.
* Subscription plans.
* Vendor stores.
* Commission calculation.
* AI features.
* Recommendation engines.
* Complex real-time chat.
* Push notification infrastructure.
* External location services.
* Advanced analytics.
* Multi-university support.
* Multi-tenancy.

This prevents scope creep and keeps the project aligned with its educational purpose.

---

## 18. Final Product Definition

Campus Exchange is a single-university student marketplace where verified students can list, discover, save, request, and discuss products.

The Admin manages the marketplace and maintains basic platform integrity.

The system demonstrates a complete academic full-stack workflow using:

```text
React + TypeScript
        ↓
Laravel REST API
        ↓
MySQL
```

The product should remain simple enough to understand and demonstrate while still covering the major concepts expected from a full-stack university project.
