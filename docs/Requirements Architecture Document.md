# Campus Exchange — Requirements Architecture Document

## 1. System Overview

Campus Exchange is an educational student marketplace system designed for a single university.

The system allows verified university students to:

* Register using their university email.
* Create product listings.
* Upload product images.
* Browse available products.
* Search, filter, and sort products.
* Save and unsave favorite products.
* Send purchase requests to sellers.
* Accept or reject purchase requests.
* Communicate through conversations and message history.
* Mark accepted products as sold.
* Report inappropriate listings or users.

An Admin manages:

* Students/users.
* Product listings.
* Product categories.
* Reported content.
* Spam or inappropriate listings.
* Basic system statistics.

The system will use React + TypeScript for the frontend, Laravel for the backend REST API, and MySQL for data storage.

The project will initially run locally and is intended for academic demonstration rather than production deployment.

The original project plan also identifies React UI, responsive pages, product cards, search/filter, dashboards, authentication, CRUD operations, user management, messaging, order/request handling, REST APIs, image upload, and optional payment/location APIs. The finalized scope removes real payment and location API requirements. 

---

## 2. System Objectives

The primary objectives are:

1. Demonstrate a complete React and Laravel application.
2. Demonstrate frontend-backend REST API communication.
3. Implement relational database design using MySQL.
4. Implement authentication and authorization.
5. Implement CRUD operations.
6. Implement product marketplace functionality.
7. Implement basic student-to-student communication.
8. Demonstrate role-based Admin functionality.
9. Demonstrate database relationships and validation.
10. Provide a complete academic project suitable for local demonstration.

The system should prioritize simplicity, clarity, and functional completeness.

---

## 3. User Roles

## 3.1 Student/User

A verified university student can:

* Register.
* Verify their university email.
* Log in and log out.
* Manage their profile.
* Create product listings.
* Edit their own listings.
* Delete their own listings.
* Upload product images.
* Browse products.
* Search products.
* Filter products.
* Sort products.
* Save products.
* Unsave products.
* View their favorites.
* Send purchase requests.
* View their requests.
* View received requests for their products.
* Accept requests.
* Reject requests.
* Send messages.
* View conversations.
* View message history.
* Report products or users.
* Mark their product as sold when appropriate.

## 3.2 Admin

Admin can:

* Log in.
* View users.
* Delete users.
* Block users.
* View products.
* Delete products.
* Manage categories.
* View reports.
* Remove reported or spam listings.
* Manage inappropriate content.
* View basic system statistics.

There will be no vendor, seller-admin, moderator, delivery-agent, or other role.

---

## 4. Module Breakdown

The system will contain the following primary modules:

1. Authentication Module
2. Student Profile Module
3. Product Listing Module
4. Category Module
5. Search and Filtering Module
6. Favorites Module
7. Purchase Request Module
8. Messaging Module
9. Reporting Module
10. Admin Management Module
11. Dashboard Module
12. Basic Analytics Module

---

## 5. Authentication Module

## 5.1 Purpose

Provide secure access to the system and ensure that only students from the selected university can create accounts.

## 5.2 Functionalities

* Student registration.
* Login.
* Logout.
* Email verification.
* Password validation.
* Password reset.
* Authentication state management.
* Role identification.
* Protected routes.

## 5.3 Business Rules

* Registration requires a valid university email address.
* Unverified accounts cannot access protected marketplace functionality.
* Each email address can have only one account.
* Admin accounts are not created through normal student registration.
* Students cannot access Admin routes.
* Admin-only operations require Admin authorization.

---

## 6. Student Profile Module

## 6.1 Functionalities

Students can:

* View their profile.
* Edit profile information.
* View their listings.
* View their requests.
* View favorites.
* Access messages.

## 6.2 Basic Profile Information

* Name
* University email
* Profile image, if required
* Contact information
* Account creation date

The profile should remain simple and suitable for an academic project.

---

## 7. Product Listing Module

## 7.1 Purpose

Allow students to sell or exchange products through the university marketplace.

## 7.2 Product Creation

A student can create a listing containing:

* Product name
* Description
* Price
* Category
* Condition
* Product image
* Contact information
* Location/campus information

## 7.3 Product Management

The owner can:

* Create listing.
* View listing.
* Edit listing.
* Delete listing.
* Mark listing as sold.

## 7.4 Product Status

The system will use two primary statuses:

Available

Sold

Workflow:

```text
Available
   ↓
Purchase Request
   ↓
Seller Accepts
   ↓
Product becomes Sold
```

Rejected requests do not change the product status.

## 7.5 Ownership Rule

A student can modify or delete only their own listings.

Admin can manage listings regardless of ownership.

---

## 8. Category Module

Categories organize products for easier browsing.

Examples may include:

* Books
* Electronics
* Clothing
* Furniture
* Accessories
* Academic Materials
* Others

The exact category list will be controlled by the Admin.

Students cannot create, rename, or delete categories.

Admin can:

* Create category.
* Edit category.
* Delete category.
* View categories.

A category should not be deleted if doing so would create invalid product references. The system should require appropriate handling of products assigned to that category.

---

## 9. Search, Filter and Sorting Module

Students should be able to discover products easily.

## 9.1 Search

Search by:

* Product name
* Relevant product text

## 9.2 Filters

The finalized scope includes:

* Category
* Price range
* Condition
* Location

## 9.3 Sorting

Possible sorting options:

* Newest
* Oldest
* Lowest price
* Highest price

The system should allow combinations of search, filtering, and sorting where practical.

---

## 10. Favorites Module

Students can save products for later.

Functionalities:

* Save product.
* Unsave product.
* View saved products.

The system only needs a simple save/unsave mechanism.

No advanced recommendation system is required.

---

## 11. Purchase Request Module

## 11.1 Purpose

Allow students to express interest in purchasing another student's product without implementing real payment processing.

## 11.2 Workflow

```text
Buyer
  ↓
Selects Product
  ↓
Sends Request
  ↓
Seller receives Request
  ↓
Accept / Reject
```

## 11.3 Request Rules

A buyer can request an available product.

The seller can:

* Accept request.
* Reject request.

When the seller accepts the request:

* The product becomes Sold.
* The request becomes accepted.
* Other active requests for the same product should no longer be actionable.

When the seller rejects a request:

* The product remains Available.
* The request becomes rejected.

## 11.4 Payment

No real payment gateway will be implemented.

The system will not process:

* Credit cards.
* Mobile payments.
* Bank payments.
* Online transactions.

The original plan mentioned a payment simulation API, but the finalized project scope does not require payment functionality. 

---

## 12. Messaging Module

## 12.1 Purpose

Provide direct communication between students.

## 12.2 Functionalities

* Start conversation.
* View conversation list.
* Send message.
* Receive messages.
* View message history.
* Continue existing conversations.

## 12.3 Scope

Messaging will use a basic database-backed conversation model.

No advanced real-time infrastructure is required.

The project does not need:

* WebSocket servers.
* Socket.io.
* Voice messaging.
* Video calling.
* Typing indicators.
* Read receipts.
* Message reactions.

The goal is to demonstrate communication functionality without unnecessary infrastructure.

---

## 13. Reporting Module

Students can report:

* Inappropriate product listings.
* Spam listings.
* Suspicious users.

## 13.1 Report Information

A report should contain:

* Reporter.
* Reported product or user.
* Reason.
* Description, where appropriate.
* Report status.
* Creation timestamp.

## 13.2 Admin Workflow

```text
Student submits report
        ↓
Admin reviews report
        ↓
Admin takes action
        ↓
Report resolved
```

Possible Admin actions:

* Ignore report.
* Remove listing.
* Block user.
* Delete user.
* Mark report as resolved.

---

## 14. Admin Management Module

## 14.1 User Management

Admin can:

* View users.
* Search users.
* View user information.
* Block users.
* Delete users.

## 14.2 Product Management

Admin can:

* View products.
* Search products.
* Delete products.
* Remove spam.
* Remove inappropriate listings.

## 14.3 Category Management

Admin can:

* Add categories.
* Edit categories.
* Delete categories.
* View categories.

## 14.4 Report Management

Admin can:

* View reports.
* Review report details.
* Take action.
* Resolve reports.

---

## 15. Dashboard Module

## 15.1 Student Dashboard

The student dashboard should provide access to:

* My Listings
* My Requests
* Received Requests
* Favorites
* Messages
* Profile

## 15.2 Admin Dashboard

The Admin dashboard should provide:

* Total users
* Total products
* Available products
* Sold products
* Total requests
* Total reports
* Basic category statistics

The analytics remain intentionally simple.

---

## 16. Basic Analytics and Reports

The system should provide basic statistics rather than advanced business intelligence.

Admin can view:

* Total registered students.
* Total active listings.
* Total sold products.
* Total product requests.
* Total reports.
* Total categories.

Possible additional statistics:

* Products by category.
* Available versus sold products.
* Recent listings.

No advanced data visualization system is required.

---

## 17. Integration Matrix

| Integration              | Required | Purpose                         |
| ------------------------ | -------- | ------------------------------- |
| React + Laravel REST API | Yes      | Frontend/backend communication  |
| MySQL                    | Yes      | Application database            |
| Laravel Authentication   | Yes      | User authentication             |
| Email Verification       | Yes      | University student verification |
| File Storage             | Yes      | Product images                  |
| Payment API              | No       | Removed from scope              |
| Location API             | No       | Removed from scope              |
| WebSocket                | No       | Basic messaging is sufficient   |
| External Analytics       | No       | Basic internal statistics       |
| Cloud Storage            | No       | Local development               |

---

## 18. Non-Functional Requirements

## 18.1 Usability

The interface should be:

* Simple.
* Responsive.
* Easy to navigate.
* Consistent across pages.
* Suitable for university students.

## 18.2 Performance

For the educational scope:

* Pages should load efficiently on a local development environment.
* API responses should remain reasonably fast.
* Images should have reasonable upload limits.
* Database queries should avoid obvious unnecessary duplication.

No production-scale performance target is required.

## 18.3 Maintainability

Code should be:

* Modular.
* Understandable.
* Consistently named.
* Separated between frontend and backend responsibilities.
* Easy for students/developers to understand.

## 18.4 Compatibility

The system should work on modern desktop browsers.

Responsive behavior should support:

* Desktop.
* Tablet.
* Mobile.

---

## 19. Security Model

The security requirements should remain appropriate for an academic application.

Required:

* Authentication.
* Email verification.
* Password hashing.
* Role-based authorization.
* API authentication.
* Backend validation.
* Ownership validation.
* Admin authorization.
* File upload validation.
* Protected frontend routes.

Important authorization rules:

```text
Student
   ↓
Can manage own products

Student
   ↓
Cannot manage another student's products

Student
   ↓
Cannot access Admin operations

Admin
   ↓
Can manage users, products, categories and reports
```

---

## 20. Data Validation

Backend validation must be applied to all important operations.

Examples:

Product:

* Name required.
* Description required.
* Price must be valid.
* Category must exist.
* Condition must be valid.
* Image must use an allowed format.
* Image size must have a reasonable limit.

Request:

* Product must exist.
* Product must be Available.
* Buyer cannot request their own product.

Message:

* Conversation must exist.
* Sender must belong to the conversation.
* Message content cannot be empty.

Category:

* Category name required.
* Category name should not unnecessarily duplicate an existing category.

---

## 21. Business Rules

The core business rules are:

1. Only verified university students can use marketplace functionality.
2. Students can create and manage their own listings.
3. Students cannot modify another student's listing.
4. Admin can manage all listings.
5. Only Admin can manage categories.
6. Students can save and unsave products.
7. Students cannot purchase their own products through the request system.
8. Only Available products can receive requests.
9. Sellers can accept or reject requests.
10. Accepting a request changes the product status to Sold.
11. Sold products cannot receive new active requests.
12. No real payment is processed.
13. Users can communicate through conversations.
14. Users can report inappropriate content.
15. Admin handles reported content.
16. Blocked users cannot continue normal marketplace activity.
17. Deleted products should no longer appear in normal marketplace browsing.

---

## 22. Developer Deliverables

The implementation should eventually contain:

### Frontend

* React + TypeScript application.
* Responsive UI.
* Authentication screens.
* Marketplace pages.
* Product details.
* Product creation/edit forms.
* Favorites.
* Request management.
* Messaging.
* Student dashboard.
* Admin dashboard.

### Backend

* Laravel application.
* REST API.
* Authentication.
* Email verification.
* Role authorization.
* Product CRUD.
* Category CRUD.
* Favorites.
* Purchase requests.
* Conversations.
* Messages.
* Reports.
* Admin management.
* Validation.

### Database

* MySQL database.
* Proper relationships.
* Foreign keys.
* Required indexes.
* Timestamps.
* Appropriate constraints.

### Academic Materials

The project should also be capable of supporting:

* ER diagram.
* Database schema explanation.
* API documentation.
* System architecture diagram.
* Testing documentation.
* Project presentation/demo.

---

## 23. Architecture Boundary

The project should deliberately remain within this boundary:

```text
                    Campus Exchange
                           |
          ┌────────────────┴────────────────┐
          │                                 │
      Student                            Admin
          │                                 │
          └──────────────┬──────────────────┘
                         │
                  React + TypeScript
                         │
                    REST API
                         │
                      Laravel
                         │
                       MySQL
```

There is no requirement for:

* Microservices.
* Separate backend services.
* Message queues.
* Redis.
* WebSockets.
* Kubernetes.
* Cloud infrastructure.
* Payment infrastructure.
* AI services.
* Recommendation engines.

This keeps the architecture aligned with the actual academic objective.

---

## 24. Requirements Architecture Conclusion

Campus Exchange should be implemented as a simple full-stack university marketplace.

The core academic value comes from demonstrating:

`React + TypeScript → REST API → Laravel → MySQL`

with authentication, email verification, CRUD operations, relationships, authorization, search/filtering, favorites, purchase requests, messaging, reporting, and Admin management.

The system should remain intentionally simple so that every major component can be understood, implemented, tested, and demonstrated during the academic project.
