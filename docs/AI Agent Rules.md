# Campus Exchange AI Agent Rules

## 1. Project Identity

Project Name: Campus Exchange

Project Type: Educational Full-Stack Web Application

Purpose:

Campus Exchange is a simple student marketplace for a single university. Verified university students can create product listings, browse products, search and filter listings, save favorites, submit purchase requests, communicate with sellers, and report inappropriate content.

An Admin can manage users, products, categories, reports, and basic statistics.

This is an academic project.

The AI must never treat this project as a commercial production marketplace unless explicitly instructed.

---

## 2. Mandatory Technology Stack

The following technologies are mandatory.

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* React Context API and local React state where required

### Backend

* Laravel
* PHP
* Laravel REST API
* Laravel Sanctum
* Laravel Eloquent ORM
* Laravel Form Requests or equivalent validation
* Laravel Policies and Middleware

### Database

* MySQL
* Laravel Migrations
* Laravel Seeders
* Laravel Factories where useful

### Development

* Git
* GitHub
* VS Code
* Postman for API testing

---

## 3. Mandatory Architecture

Use this architecture:

```text
React + TypeScript
↓
REST API
↓
Laravel
↓
MySQL
```

The frontend must communicate with the backend through the Laravel REST API.

The frontend must not directly access MySQL.

The backend must remain responsible for:

* Authentication
* Authorization
* Validation
* Business rules
* Database operations
* File handling
* API responses

---

## 4. Authentication Rules

Use Laravel authentication and Sanctum.

University email verification is mandatory.

Only students from the selected university can register.

Student registration must not allow users to select the Admin role.

Admin accounts must be created securely outside public registration.

Protected backend routes must verify authentication.

Admin routes must verify Admin authorization.

Frontend route protection must never replace backend authorization.

---

## 5. Product Rules

Students can:

* Create their own products.
* View products.
* Edit their own products.
* Delete their own products.
* Save products.
* Unsave products.
* Request available products.
* Message sellers.
* Report products.

Students cannot:

* Edit another student's product.
* Delete another student's product.
* Request their own product.
* Manage categories.
* Access Admin functionality.

Products use only these primary states:

Available
Sold

A product starts as Available.

When a seller accepts a purchase request, the product becomes Sold.

Sold products cannot receive new purchase requests.

---

## 6. Purchase Request Rules

Purchase requests use:

Pending
Accepted
Rejected

Workflow:

Pending
├── Accepted
└── Rejected

Only the seller can accept or reject a request for their product.

The backend must verify that the product is still Available before accepting a request.

When a request is accepted:

1. Request becomes Accepted.
2. Product becomes Sold.
3. Other active requests for that product become unavailable or rejected according to the implemented business rule.

This operation must be handled safely as a database transaction.

---

## 7. Messaging Rules

Messaging must remain simple.

Required:

* Conversations
* Message history
* Send messages
* View conversations

Do not implement:

* WebSockets
* Socket.io
* Typing indicators
* Read receipts
* Voice messages
* Video calls
* Reactions
* Message forwarding

REST API communication is sufficient.

---

## 8. Admin Rules

Admin can:

* View users.
* Block users.
* Delete users.
* View products.
* Delete products.
* Manage categories.
* View reports.
* Resolve reports.
* Remove spam listings.
* View basic analytics.

Only Admin can manage categories.

Admin functionality must be protected by backend authorization.

---

## 9. Search and Filtering

Implement search and filtering through Laravel and MySQL.

Required filters:

* Category
* Price range
* Condition
* Location

Required sorting:

* Newest
* Oldest
* Lowest price
* Highest price

Do not introduce Elasticsearch or another external search engine.

---

## 10. Image Handling

Use Laravel local file storage.

Validate:

* File type
* File size
* Upload errors

Do not add Cloudinary, AWS S3, or other external image storage unless explicitly requested.

---

## 11. Libraries and Dependencies

Only add a dependency when it solves a real project requirement.

Before adding a new package:

1. Check whether the current stack already provides the functionality.
2. Check whether the functionality can be implemented simply without a dependency.
3. Confirm that the package is compatible with the existing project.
4. Avoid adding packages only for convenience.

Do not install large libraries for small requirements.

Do not replace an existing project technology without explicit approval.

---

## 12. Dependencies to Avoid

Do not introduce:

* Redux unless explicitly required.
* Next.js.
* Node.js backend.
* Express.js.
* MongoDB.
* GraphQL.
* Socket.io.
* Redis.
* Elasticsearch.
* Kubernetes.
* Microservices.
* Payment SDKs.
* AI APIs.
* Recommendation engines.
* Complex analytics platforms.
* Cloudinary.
* Firebase backend.
* Unnecessary UI libraries.

The project is intentionally simple.

---

## 13. UI Rules

Follow the Design Document.

The UI must be:

* Clean
* Modern
* Responsive
* Student-friendly
* Simple
* Consistent

Use reusable components.

Do not create different versions of the same component unnecessarily.

Maintain consistent:

* Colors
* Typography
* Spacing
* Buttons
* Cards
* Forms
* Modals
* Status badges

Avoid:

* Excessive animation
* Heavy 3D effects
* Complex gradients
* Decorative effects that reduce usability
* Enterprise-style dashboards
* Unnecessary visual complexity

---

## 14. Responsive Rules

The application must support:

* Mobile
* Tablet
* Desktop

Do not simply shrink desktop layouts.

Adapt layouts appropriately.

Examples:

* Product grids reduce columns.
* Dashboard cards stack.
* Filters become a drawer or modal.
* Tables become responsive cards where necessary.
* Messaging becomes single-column on mobile.

---

## 15. Backend Validation Rules

Never rely only on frontend validation.

Every important request must be validated by Laravel.

Validate:

* Authentication
* Registration
* Products
* Categories
* Favorites
* Requests
* Messages
* Reports
* Profiles
* Admin operations

Frontend validation improves UX.

Backend validation protects the system.

---

## 16. Authorization Rules

Always verify ownership and permissions on the backend.

Example:

A frontend button may hide the Edit button for another user's product.

Laravel must still verify:

* Authenticated user exists.
* User owns the product.
* User has permission to modify it.

Never trust:

* Frontend route restrictions.
* Hidden buttons.
* Client-side roles.
* Client-provided ownership information.

---

## 17. Error Handling

The application must handle errors gracefully.

Backend errors should return structured JSON.

Recommended structure:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

Frontend must display understandable messages.

Never expose:

* Database credentials
* Stack traces
* Internal server paths
* Environment variables
* Sensitive backend information

Do not silently ignore errors.

Log useful technical errors during development.

---

## 18. Loading and Empty States

Every asynchronous feature should have appropriate states.

Implement:

* Loading state
* Success state
* Empty state
* Error state

Examples:

No favorites:

"No saved products yet."

No messages:

"No conversations yet."

No listings:

"You have not created any listings yet."

---

## 19. API Rules

Use RESTful API design.

Organize endpoints around resources:

* auth
* users
* products
* categories
* favorites
* requests
* conversations
* messages
* reports
* admin

Use consistent HTTP methods.

Use appropriate status codes.

Do not place business logic inside React components.

---

## 20. Database Rules

Use MySQL.

Use Laravel migrations.

Use foreign keys.

Use appropriate indexes.

Use Eloquent relationships.

Do not duplicate relational data unnecessarily.

Required core tables:

* users
* categories
* products
* favorites
* purchase_requests
* conversations
* messages
* reports

Do not create tables for features that are outside the project scope.

---

## 21. Code Quality Rules

Write readable code.

Use meaningful names.

Keep components focused.

Keep controllers reasonably small.

Move complicated validation into Form Requests.

Use Policies for authorization.

Use Eloquent relationships instead of unnecessary raw SQL.

Avoid duplicated code.

Avoid giant components.

Avoid giant controllers.

Avoid unnecessary abstractions.

The project should remain understandable to a university student reviewing the source code.

---

## 22. AI Agent Boundaries

The AI agent must not independently change the project's fundamental architecture.

Do not independently:

* Change React to another framework.
* Change Laravel to another backend.
* Change MySQL to another database.
* Introduce microservices.
* Add payment infrastructure.
* Add external AI services.
* Add cloud infrastructure.
* Add complex real-time architecture.
* Expand the project into a production marketplace.

If a requirement appears to require architectural expansion, stop and ask for approval.

---

## 23. Scope Control

Do not add features simply because they are common in commercial marketplaces.

The following are outside the current scope:

* Payments
* Subscriptions
* Delivery
* Commission
* Vendor stores
* Multi-university support
* AI recommendations
* Advanced notifications
* Advanced analytics
* Real-time WebSocket chat
* Location APIs

If the AI identifies a useful additional feature, record it as a possible future enhancement instead of implementing it automatically.

---

## 24. Documentation Rules

The following documents are the project's source of truth:

1. Requirements Architecture Document
2. Functional Specification Document
3. Database Architecture Document
4. PRD
5. Design Document
6. Tech Stack Document
7. rule.md
8. phases.md
9. memory.md

If two documents appear inconsistent:

1. Identify the conflict.
2. Do not silently choose a solution.
3. Report the conflict.
4. Ask for clarification when necessary.

Do not rewrite requirements simply to make implementation easier.

---

## 25. AI Coding Workflow

Before implementing a feature:

1. Understand the requirement.
2. Check the relevant documentation.
3. Inspect the existing code.
4. Identify affected files.
5. Plan the implementation.
6. Implement the smallest appropriate change.
7. Test the change.
8. Check for regressions.
9. Update documentation if required.
10. Record the work in memory.md.

Do not blindly generate large amounts of code.

---

## 26. File Modification Rules

Before modifying files:

* Inspect the existing implementation.
* Preserve working functionality.
* Avoid unnecessary rewrites.
* Avoid unrelated changes.

Never modify:

* node_modules
* .git
* build
* dist

unless explicitly required and approved.

Do not delete files without understanding their usage.

---

## 27. Dependency Installation Rules

Do not install dependencies automatically just because they might be useful.

Before installation:

* Explain why it is needed.
* Confirm it is compatible.
* Check whether the existing stack can solve the problem.
* Avoid unnecessary dependencies.

---

## 28. Environment and Secrets

Never hardcode:

* Database passwords.
* API keys.
* Email credentials.
* Authentication secrets.

Use environment variables.

Never commit `.env` files containing secrets.

Use `.env.example` for documentation.

---

## 29. Testing Rules

After implementing a feature:

1. Run relevant backend tests.
2. Run relevant frontend checks.
3. Test the API.
4. Test the browser workflow.
5. Check console errors.
6. Check network errors.
7. Verify database behavior.

Do not claim a feature is complete without testing it.

---

## 30. General Rule

The AI agent should optimize for:

```text
Correctness
↓
Simplicity
↓
Maintainability
↓
User Experience
↓
Visual Polish
```

Not:

```text
Complexity
↓
Number of Dependencies
↓
Number of Features
```

The goal is a complete, understandable, working educational project.

---

## 31. Final Rule

When uncertain:

Do not guess.

Inspect the project and documentation first.

If the requirement remains unclear and the decision could affect architecture, database structure, security, or user workflow, ask for clarification before implementing it.
