# Functional Specification Document

## 1. Document Purpose

This document defines the detailed functional behavior of Campus Exchange based on the finalized Requirements Architecture and discovery decisions.

The system is a simple educational marketplace for students of a single university.

Technology boundary:

```text
React + TypeScript
        ↓
    REST API
        ↓
      Laravel
        ↓
       MySQL
```

No multi-vendor architecture, real payment processing, complex real-time infrastructure, or enterprise-level functionality is included.

---

## 2. Authentication Module

## 2.1 Student Registration

### Workflow

```text
Student
  ↓
Registration Form
  ↓
Enter University Email
  ↓
Enter Account Information
  ↓
Backend Validation
  ↓
Account Created
  ↓
Verification Email
  ↓
Student Verifies Email
  ↓
Account Activated
```

### Required Fields

* Name
* University email
* Password
* Password confirmation

### Validation

* Name is required.
* Email is required.
* Email must have the approved university domain.
* Email must be unique.
* Password must satisfy the defined password rules.
* Password confirmation must match.

### Business Rules

* Only the selected university's students can register.
* Unverified users cannot access marketplace functionality.
* Student registration cannot create an Admin account.

---

## 3. Login

### Workflow

```text
Email + Password
       ↓
Validation
       ↓
Authentication
       ↓
Check Email Verification
       ↓
Student Dashboard
```

### Failure Cases

* Invalid email.
* Invalid password.
* Unverified email.
* Blocked account.
* Deleted account.

The API must return an appropriate validation or authorization response.

---

## 4. Logout

Authenticated users can log out.

The authentication session/token must be invalidated appropriately.

After logout:

* Protected API requests must no longer be authorized.
* Protected frontend pages must redirect to authentication.

---

## 5. Password Management

The system should support:

* Forgot password.
* Password reset.
* New password confirmation.

Password reset must use the student's verified email.

---

## 6. Student Profile Module

## 6.1 View Profile

Student can view:

* Name
* University email
* Contact information
* Profile image, if implemented
* Account creation information

## 6.2 Edit Profile

Student can update permitted profile fields.

The university email should not be freely changeable because it determines university membership.

## 6.3 Profile Authorization

A student can modify only their own profile.

Admin can view user information but profile ownership remains with the student.

---

## 7. Product Module

## 7.1 Create Product

### Workflow

```text
Student
  ↓
Create Listing
  ↓
Enter Product Information
  ↓
Upload Image
  ↓
Validation
  ↓
Save Product
  ↓
Status = Available
```

### Required Data

* Product name
* Description
* Price
* Category
* Condition
* Image
* Location
* Contact information

### Validation

* Product name required.
* Description required.
* Price must be valid.
* Category must exist.
* Condition must be valid.
* Location required.
* Contact information required.
* Image must satisfy allowed file type and size rules.

---

## 8. Product Read/View

Students can view:

* Product image
* Product name
* Description
* Price
* Category
* Condition
* Location
* Seller information
* Product status
* Relevant actions

The product page should provide appropriate actions such as:

* Save
* Unsave
* Request to Buy
* Message Seller
* Report

Actions depend on the product state and current user's relationship with the product.

---

## 9. Product Update

Only the product owner can edit their own product.

Admin can manage products regardless of ownership.

Students cannot edit another student's listing.

### Editable Information

* Name
* Description
* Price
* Category
* Condition
* Image
* Location
* Contact information

---

## 10. Product Delete

A student can delete their own listing.

Admin can delete any listing.

After deletion:

* The listing must no longer appear in normal marketplace results.
* Users should not be able to create new requests for it.
* Related records must be handled according to the database design.

---

## 11. Product Status

The system uses two primary states:

```text
Available
   ↓
Sold
```

A product starts as:

`Available`

When a seller accepts a purchase request:

`Available → Sold`

A Sold product cannot receive new purchase requests.

---

## 12. Search Module

Students can search products using product-related text.

### Search Example

```text
"Calculus Book"
```

The system should return relevant available products.

Search should work together with filters where practical.

---

## 13. Filter Module

The following filters are required:

* Category
* Price range
* Condition
* Location

Filters can be combined.

Example:

```text
Category = Books
Price = 200-500
Condition = Used
Location = Campus
```

The backend should return only products matching the selected conditions.

---

## 14. Sorting Module

Available sorting options:

* Newest
* Oldest
* Lowest price
* Highest price

Sorting should be performed consistently by the backend query.

---

## 15. Favorites Module

## 15.1 Save Product

Student selects Save.

System creates a favorite relationship between:

```text
Student + Product
```

The same product should not be saved multiple times by the same student.

## 15.2 Unsave Product

Student selects Unsave.

The favorite relationship is removed.

## 15.3 Favorites Page

Student can view all saved products.

Sold or deleted products should be handled appropriately when displaying favorites.

---

## 16. Purchase Request Module

## 16.1 Create Request

### Workflow

```text
Buyer
  ↓
Available Product
  ↓
Request to Buy
  ↓
Backend Validation
  ↓
Request Created
  ↓
Seller Can Review
```

### Validation

* Buyer must be authenticated.
* Buyer must be verified.
* Product must exist.
* Product must be Available.
* Buyer cannot request their own product.
* Duplicate active request should not be allowed.

---

## 17. Seller Request Management

Seller can view requests associated with their products.

Each request should provide:

* Buyer information
* Product information
* Request status
* Request date

Available actions:

* Accept
* Reject

---

## 18. Accept Request

### Workflow

```text
Seller
  ↓
Accept Request
  ↓
Validate Product
  ↓
Request = Accepted
  ↓
Product = Sold
```

### Important Rule

The product must still be Available when the seller accepts the request.

If another request has already been accepted, the seller cannot accept another request for the same product.

Other pending requests should become unavailable or rejected according to the final implementation.

---

## 19. Reject Request

```text
Seller
  ↓
Reject
  ↓
Request = Rejected
  ↓
Product remains Available
```

Rejecting a request does not change the product status.

---

## 20. Request States

The request lifecycle is:

```text
Pending
   ├──→ Accepted
   └──→ Rejected
```

Accepted requests are associated with Sold products.

Rejected requests cannot be accepted later.

---

## 21. Messaging Module

## 21.1 Start Conversation

A student can start a conversation with another student regarding a product.

The conversation should associate the participants.

Example:

```text
Buyer
  ↕
Seller
  ↕
Conversation
  ↕
Messages
```

## 21.2 Conversation List

Student can view:

* Other participant
* Related product, where applicable
* Latest message
* Message timestamp

## 21.3 Send Message

Required:

* Conversation
* Sender
* Message content

Message cannot be empty.

## 21.4 Message History

Users can view previous messages belonging to conversations they participate in.

A student must not be able to access another user's private conversation.

---

## 22. Messaging Scope

The educational version does not require:

* WebSockets
* Typing indicators
* Read receipts
* Voice messages
* Video calls
* Reactions
* Message editing
* Message forwarding

Basic conversation and message history are sufficient.

---

## 23. Reporting Module

## 23.1 Report Product

Student can report a product.

Required:

* Product
* Reporter
* Reason
* Optional description

## 23.2 Report User

Student can report another user.

Required:

* Reported user
* Reporter
* Reason
* Optional description

A student should not be allowed to report themselves.

---

## 24. Report States

Reports can use a simple lifecycle:

```text
Pending
   ↓
Reviewed
   ↓
Resolved
```

The exact implementation can keep `Pending` and `Resolved` if the academic requirements favor a simpler model.

---

## 25. Admin User Management

Admin can view all registered users.

### Admin Actions

* View user
* Block user
* Delete user

### Block

A blocked student cannot perform normal marketplace activities.

### Delete

Deleting a user must handle related products, requests, messages, favorites, and reports safely.

---

## 26. Admin Product Management

Admin can:

* View products.
* Search products.
* Delete products.
* Remove spam.
* Remove inappropriate listings.

Admin does not need to impersonate students.

---

## 27. Admin Category Management

Admin can:

* Create category.
* View categories.
* Edit category.
* Delete category.

Students cannot modify categories.

### Category Validation

Category name:

* Required.
* Unique.
* Reasonably short.

A category that is actively referenced by products should not cause broken product records when deleted.

---

## 28. Admin Report Management

Admin can:

* View reports.
* Open report details.
* Identify reported user/product.
* Take appropriate action.
* Resolve report.

Possible actions:

```text
Ignore
Remove Product
Block User
Delete User
Resolve Report
```

---

## 29. Student Dashboard

The Student Dashboard should provide direct access to:

### My Listings

* View listings.
* Create listing.
* Edit listing.
* Delete listing.
* View status.

### My Requests

* Pending requests.
* Accepted requests.
* Rejected requests.

### Received Requests

* Requests received for owned products.
* Accept.
* Reject.

### Favorites

* Saved products.
* Unsave.

### Messages

* Conversations.
* Message history.

### Profile

* View profile.
* Edit profile.

---

## 30. Admin Dashboard

The Admin Dashboard should provide basic system statistics.

Required statistics:

* Total users
* Total products
* Available products
* Sold products
* Total requests
* Total reports
* Total categories

Optional breakdowns:

* Products by category
* Recent listings
* Recent reports

---

## 31. Role Permission Matrix

| Function           |           Student |        Admin |
| ------------------ | ----------------: | -----------: |
| Register           |               Yes |           No |
| Login              |               Yes |          Yes |
| Email verification |               Yes | Not required |
| Edit own profile   |               Yes |          Yes |
| View products      |               Yes |          Yes |
| Create product     |               Yes |     Optional |
| Edit own product   |               Yes |          Yes |
| Delete own product |               Yes |          Yes |
| Delete any product |                No |          Yes |
| Search products    |               Yes |          Yes |
| Filter products    |               Yes |          Yes |
| Save product       |               Yes |           No |
| Send request       |               Yes |           No |
| Accept request     | Yes, own products |           No |
| Reject request     | Yes, own products |           No |
| Messaging          |               Yes | Not required |
| Report product     |               Yes |           No |
| Report user        |               Yes |           No |
| View reports       |                No |          Yes |
| Manage categories  |                No |          Yes |
| View users         |                No |          Yes |
| Block users        |                No |          Yes |
| Delete users       |                No |          Yes |
| View analytics     |                No |          Yes |

---

## 32. CRUD Matrix

| Module        | Create | Read | Update | Delete |
| ------------- | -----: | ---: | -----: | -----: |
| Users         |    Yes |  Yes |    Yes |    Yes |
| Products      |    Yes |  Yes |    Yes |    Yes |
| Categories    |    Yes |  Yes |    Yes |    Yes |
| Favorites     |    Yes |  Yes |     No |    Yes |
| Requests      |    Yes |  Yes | Status |     No |
| Conversations |    Yes |  Yes |     No |     No |
| Messages      |    Yes |  Yes |     No |     No |
| Reports       |    Yes |  Yes | Status |     No |

User creation is primarily handled through registration.

Admin management actions can also affect users.

---

## 33. Important Edge Cases

## Product

If a product is Sold:

* New requests must be blocked.
* Request-to-buy action must be unavailable.
* Product should remain visible as Sold if the application requires historical visibility.

## Purchase Request

If two students request the same product:

```text
Product = Available

Request A = Pending
Request B = Pending

Seller accepts Request A

Product = Sold
Request A = Accepted
Request B = Rejected/Unavailable
```

The backend must prevent multiple successful acceptances.

## Own Product

A student cannot request to buy their own product.

## Deleted Product

A deleted product must not be requestable.

## Blocked User

A blocked student should not be able to create listings, requests, messages, or other marketplace activity.

## Deleted User

Related records must not create broken references.

---

## 34. API Behavior Requirements

The frontend must never be treated as the final authority for permissions.

For example:

```text
React:
"Hide Delete Button"

Laravel:
"Verify that the authenticated user owns this product"
```

Both can exist, but backend authorization is mandatory.

All important operations should have:

* Authentication check.
* Authorization check.
* Validation.
* Database operation.
* Appropriate response.

---

## 35. Error Handling

The API should provide understandable responses for:

* Validation errors.
* Authentication errors.
* Authorization errors.
* Missing resources.
* Invalid requests.
* Duplicate operations.
* Invalid product states.

The React frontend should display appropriate user-facing messages.

---

## 36. Database State Transitions

### Product

```text
Available
    ↓
Sold
```

### Purchase Request

```text
Pending
   ├──→ Accepted
   └──→ Rejected
```

### Report

```text
Pending
   ↓
Resolved
```

### User

The account can conceptually be:

```text
Active
   ↓
Blocked
```

Deletion is treated as an account removal operation rather than a normal user state.

---

## 37. Frontend Route Requirements

A reasonable route structure is:

```text
/
├── /login
├── /register
├── /verify-email
├── /forgot-password
├── /reset-password
│
├── /products
├── /products/:id
├── /favorites
│
├── /dashboard
├── /dashboard/listings
├── /dashboard/requests
├── /dashboard/favorites
├── /dashboard/messages
├── /dashboard/profile
│
├── /admin
├── /admin/users
├── /admin/products
├── /admin/categories
├── /admin/reports
└── /admin/analytics
```

The exact route naming can be adjusted during implementation.

---

## 38. API Resource Groups

The Laravel API should logically organize endpoints around:

```text
/auth
/users
/products
/categories
/favorites
/requests
/conversations
/messages
/reports
/admin
```

No separate microservices are required.

---

## 39. Academic Testing Requirements

The project should test the major workflows.

### Authentication

* Registration.
* Invalid university email.
* Email verification.
* Login.
* Logout.
* Password reset.

### Products

* Create.
* Read.
* Update.
* Delete.
* Search.
* Filter.
* Sort.

### Favorites

* Save.
* Unsave.
* Duplicate save prevention.

### Requests

* Create request.
* Reject request.
* Accept request.
* Sold product protection.
* Own product protection.

### Messaging

* Create conversation.
* Send message.
* Retrieve history.
* Unauthorized conversation access.

### Admin

* User management.
* Product management.
* Category management.
* Report management.
* Analytics.

---

## 40. Functional Completion Criteria

The functional implementation can be considered complete when:

1. Students can register with a valid university email.
2. Students can verify their email.
3. Students can authenticate.
4. Students can manage their own products.
5. Students can browse products.
6. Search, filter, and sorting work.
7. Favorites work.
8. Purchase requests work.
9. Seller accept/reject workflow works.
10. Product status changes correctly.
11. Conversations work.
12. Message history is preserved.
13. Reporting works.
14. Admin can manage users.
15. Admin can manage products.
16. Admin can manage categories.
17. Admin can manage reports.
18. Basic analytics are displayed.
19. Unauthorized operations are rejected by Laravel.
20. The complete system works locally.

This specification intentionally keeps every workflow implementable with React + TypeScript, Laravel, and MySQL without introducing unnecessary infrastructure.
