# Tech Stack Document

## 1. Project Overview

Campus Exchange is an educational single-university marketplace.

The system will use a simple full-stack architecture:

```text
React + TypeScript
        ↓
    REST API
        ↓
      Laravel
        ↓
       MySQL
```

The technology choices prioritize:

* Simplicity
* Educational value
* Maintainability
* Easy local development
* Clear frontend/backend separation
* Easy demonstration

The project does not require enterprise infrastructure.

---

## 2. Frontend

## Technology

React + TypeScript

### Purpose

React handles:

* User interface
* Client-side routing
* Forms
* Product browsing
* Dashboards
* Messaging interface
* Admin interface
* API integration

TypeScript provides:

* Type safety
* Better IDE support
* Clear API data structures
* Easier maintenance

---

## 3. Frontend Build Tool

Recommended:

Vite

Purpose:

* Fast development server
* Simple React setup
* TypeScript support
* Efficient development workflow

---

## 4. Frontend Routing

Recommended:

React Router

Used for:

* Authentication pages
* Marketplace pages
* Product details
* Student dashboard
* Admin dashboard
* Protected routes

Example:

```text
/login
/register
/products
/products/:id
/dashboard
/dashboard/listings
/dashboard/requests
/dashboard/messages
/admin
/admin/users
/admin/products
/admin/categories
/admin/reports
```

---

## 5. Styling

Recommended:

Tailwind CSS

Purpose:

* Responsive layouts
* Reusable styling
* Consistent spacing
* Responsive breakpoints
* Fast component development

A standard CSS approach is also acceptable if required by the course.

No heavy UI framework is necessary.

---

## 6. HTTP Client

Recommended:

Axios

Used for:

* GET requests
* POST requests
* PUT/PATCH requests
* DELETE requests
* Authentication requests
* Product APIs
* Request APIs
* Messaging APIs
* Admin APIs

A centralized Axios configuration should handle the Laravel API base URL.

---

## 7. Frontend State Management

Recommended:

React Context API and React state.

Use local component state for simple UI state.

Use Context where application-wide state is required, such as:

* Authentication user
* Authentication status
* Basic application settings

A large state-management library such as Redux is unnecessary for this project.

---

## 8. Backend

## Technology

Laravel

Laravel will provide:

* REST API
* Authentication
* Email verification
* Authorization
* Validation
* CRUD operations
* Database interaction
* File handling
* Business logic
* API responses

The backend should remain a single Laravel application.

---

## 9. Laravel Authentication

Recommended:

Laravel Sanctum

Purpose:

* API authentication
* SPA authentication
* Protected API routes
* User session/token management

Authentication must be enforced on the backend.

The frontend should never be responsible for deciding whether a user has permission to perform an operation.

---

## 10. Backend API Architecture

Use REST-style API endpoints.

Logical resource groups:

```text
/api/auth
/api/users
/api/products
/api/categories
/api/favorites
/api/requests
/api/conversations
/api/messages
/api/reports
/api/admin
```

Laravel controllers should remain organized by module.

---

## 11. Backend Validation

Use Laravel's built-in validation system.

Validation should cover:

* Registration
* Login
* Product creation
* Product editing
* Category management
* Purchase requests
* Messages
* Reports
* Profile updates

The backend remains the final validation authority.

---

## 12. Authorization

Use Laravel authorization mechanisms such as:

* Policies
* Gates
* Middleware

Examples:

```text
Student
  ↓
Can edit own Product

Student
  ↓
Cannot edit another user's Product

Admin
  ↓
Can manage any Product
```

Admin routes must have Admin authorization.

---

## 13. Database

## Technology

MySQL

Purpose:

Store:

* Users
* Categories
* Products
* Favorites
* Purchase requests
* Conversations
* Messages
* Reports

MySQL is appropriate because the project contains clear relational data.

---

## 14. ORM

Laravel Eloquent ORM

Purpose:

* Database queries
* Relationships
* CRUD
* Model-based data access
* Relationship loading

Expected relationships include:

```text
User
 ├── hasMany Products
 ├── hasMany Favorites
 ├── hasMany Requests
 ├── hasMany Messages
 └── hasMany Reports

Category
 └── hasMany Products

Product
 ├── belongsTo User
 ├── belongsTo Category
 ├── hasMany Requests
 └── hasMany Favorites
```

---

## 15. Database Migrations

Laravel migrations should define the database schema.

Migrations should cover:

* Users
* Categories
* Products
* Favorites
* Purchase requests
* Conversations
* Messages
* Reports

Foreign keys and appropriate indexes should be included.

---

## 16. Database Seeders

Laravel seeders should provide demonstration data.

Recommended:

* One Admin.
* Several students.
* Multiple categories.
* Multiple products.
* Example requests.
* Example conversations.
* Example messages.
* Example reports.

This allows the project to be demonstrated immediately after database setup.

---

## 17. Image Storage

For the educational version:

Use Laravel local file storage.

Product images should be stored locally.

The application should validate:

* File type.
* File size.
* Upload success.

No Cloudinary or external image service is required.

---

## 18. Authentication Email

University email verification is required.

The system should:

1. Register student.
2. Send verification email.
3. Student verifies email.
4. Student gains access to marketplace functionality.

The exact university email domain should be configurable rather than hardcoded throughout the application.

---

## 19. Messaging Architecture

Messaging will use standard database storage.

Structure:

```text
Conversation
      ↓
Messages
```

No:

* Socket.io
* WebSockets
* Redis Pub/Sub
* Message broker

are required.

The frontend can refresh or request updated messages through the REST API.

---

## 20. Search and Filtering

Search and filtering should initially use MySQL queries through Laravel.

Supported:

* Product name search
* Category
* Price range
* Condition
* Location
* Sorting

No external search engine is required.

Do not introduce Elasticsearch or similar infrastructure.

---

## 21. File and Project Structure

A simple structure is recommended.

### Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── contexts/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── assets/
├── public/
└── package.json
```

### Backend

```text
backend/
├── app/
│   ├── Models/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Requests/
│   │   └── Resources/
│   └── Policies/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
├── storage/
└── .env
```

---

## 22. API Response Structure

API responses should use a consistent JSON structure.

Example success:

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {}
}
```

Example validation failure:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

The exact response structure should remain consistent across modules.

---

## 23. Environment Configuration

Environment-specific configuration should use environment variables.

Examples:

```text
APP_URL
APP_ENV
APP_KEY

DB_CONNECTION
DB_HOST
DB_PORT
DB_DATABASE
DB_USERNAME
DB_PASSWORD

MAIL_MAILER
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

Frontend:

```text
VITE_API_URL
```

Credentials must never be hardcoded into source code.

---

## 24. Development Environment

Recommended local environment:

### Frontend

* Node.js
* npm
* Vite
* React
* TypeScript

### Backend

* PHP
* Composer
* Laravel
* MySQL

### Development Tools

* VS Code
* Git
* GitHub
* Browser Developer Tools
* Postman or similar API testing tool

---

## 25. API Testing

Recommended:

Postman

Use it to test:

* Authentication.
* Products.
* Categories.
* Favorites.
* Requests.
* Conversations.
* Messages.
* Reports.
* Admin APIs.

API testing should be performed before integrating complicated frontend workflows.

---

## 26. Testing Strategy

The project should use a practical testing approach.

### Backend

Test:

* Validation.
* Authentication.
* Authorization.
* CRUD.
* Relationships.
* Request workflow.
* Product status changes.

### Frontend

Test:

* Forms.
* Navigation.
* Protected routes.
* API error handling.
* Product interactions.
* Dashboard behavior.

### Manual Testing

Perform complete workflows through the browser.

---

## 27. Security Technologies

Use Laravel's built-in security capabilities.

Required:

* Password hashing.
* CSRF protection where applicable.
* Authentication.
* Authorization.
* Request validation.
* File upload validation.
* Secure environment configuration.

No custom cryptographic implementation is required.

---

## 28. Deployment

For the current project stage:

Local development only.

No deployment infrastructure is required.

Future deployment can be added later without changing the core application architecture.

---

## 29. Version Control

Use Git.

Recommended repository structure:

```text
campus-exchange/
├── frontend/
├── backend/
├── docs/
└── README.md
```

Commit changes logically.

Example:

```text
feat: add product listing
feat: implement favorites
feat: add purchase request workflow
fix: validate university email
```

---

## 30. Documentation

The project should maintain:

```text
docs/
├── Requirements_Architecture.md
├── Functional_Specification.md
├── Database_Architecture.md
├── PRD.md
├── Design_Document.md
└── Tech_Stack.md
```

These documents should remain aligned with the actual implementation.

The uploaded AI Website Building Guide specifically recommends using PRD, Design Document, and Tech Stack Document as the foundation for AI-assisted website development and then validating the implementation against those documents. 

---

## 31. Technology Decision Summary

| Layer           | Technology            | Reason                      |
| --------------- | --------------------- | --------------------------- |
| Frontend        | React                 | Component-based UI          |
| Language        | TypeScript            | Type safety                 |
| Build Tool      | Vite                  | Simple and fast development |
| Styling         | Tailwind CSS          | Responsive UI development   |
| Routing         | React Router          | Client-side routing         |
| HTTP            | Axios                 | REST API communication      |
| State           | React State/Context   | Simple project-wide state   |
| Backend         | Laravel               | Full-featured PHP framework |
| API             | Laravel REST API      | Frontend/backend separation |
| Authentication  | Laravel Sanctum       | SPA/API authentication      |
| Validation      | Laravel Validation    | Backend validation          |
| ORM             | Eloquent              | Database relationships      |
| Database        | MySQL                 | Relational data             |
| Storage         | Laravel local storage | Simple image handling       |
| API Testing     | Postman               | API testing                 |
| Version Control | Git/GitHub            | Source management           |

---

## 32. Technology Exclusions

The following technologies are intentionally excluded:

* Next.js
* Node.js backend
* Express.js
* MongoDB
* Redux
* GraphQL
* Socket.io
* Redis
* Elasticsearch
* Docker
* Kubernetes
* AWS infrastructure
* Cloudinary
* Stripe
* PayPal
* Firebase backend
* Microservices

These technologies are unnecessary for the current academic scope.

---

## 33. Final Technology Architecture

```text
┌───────────────────────────────────────────┐
│              React + TypeScript           │
│                                           │
│  Pages • Components • Forms • Dashboards  │
│  Search • Products • Requests • Messages  │
└─────────────────────┬─────────────────────┘
                      │
                  Axios / REST
                      │
                      ▼
┌───────────────────────────────────────────┐
│                  Laravel                  │
│                                           │
│ Controllers • Requests • Policies         │
│ Models • Services • Authentication        │
│ Validation • API Resources                │
└─────────────────────┬─────────────────────┘
                      │
                  Eloquent ORM
                      │
                      ▼
┌───────────────────────────────────────────┐
│                   MySQL                   │
│                                           │
│ Users • Products • Categories             │
│ Favorites • Requests • Conversations      │
│ Messages • Reports                        │
└───────────────────────────────────────────┘
```

This technology stack is intentionally limited to what the Campus Exchange educational project actually needs. It provides enough functionality to demonstrate a complete full-stack application without introducing unnecessary technical complexity.
