# Campus Exchange

{
"project": {
"name": "Campus Exchange",
"type": "Educational Single-University Student Marketplace",
"execution_phase": "Frontend Phase",
"objective": "Build the complete frontend foundation for Campus Exchange using React and TypeScript. The frontend must follow the approved PRD, Design Document, Functional Specification Document, and Tech Stack Document."
},
"source_of_truth": {
"documents": [
"PRD.md",
"Design_Document.md",
"Functional_Specification.md",
"Database_Architecture.md",
"Tech_Stack.md",
"rule.md",
"phases.md",
"memory.md"
],
"instruction": "Read and follow these documents before implementing anything. Do not invent requirements that conflict with them. The project is educational and intentionally simple."
},
"critical_boundary": {
"frontend_only": true,
"backend_logic": false,
"database_logic": false,
"api_implementation": false,
"authentication_backend": false,
"instruction": "Build only the frontend. Do not implement Laravel, MySQL, database migrations, backend authentication, API endpoints, server-side business logic, payment systems, WebSockets, or external backend services."
},
"technology": {
"framework": "React",
"language": "TypeScript",
"build_tool": "Vite",
"routing": "React Router",
"styling": "Tailwind CSS",
"http_client": "Axios",
"state_management": "React state and Context API where required",
"icons": "Use a lightweight icon library only if already available or clearly required. Do not add unnecessary dependencies."
},
"project_scope": {
"roles": [
"Student",
"Admin"
],
"university_scope": "Single university",
"multi_vendor": false,
"real_payment": false,
"real_time_websocket": false,
"ai_features": false,
"subscription": false,
"delivery_system": false,
"location_api": false,
"advanced_notifications": false
},
"design_direction": {
"style": [
"modern",
"clean",
"minimal",
"student-friendly",
"academic",
"responsive"
],
"primary_color": "#2563EB",
"primary_hover": "#1D4ED8",
"secondary_color": "#0F172A",
"background": "#F8FAFC",
"surface": "#FFFFFF",
"primary_text": "#0F172A",
"secondary_text": "#64748B",
"border": "#E2E8F0",
"success": "#16A34A",
"warning": "#F59E0B",
"error": "#DC2626",
"font": "Inter",
"max_content_width": "1200px",
"instruction": "Do not create an enterprise dashboard aesthetic, excessive gradients, heavy animations, 3D effects, or unnecessary decorative elements."
},
"responsive_rules": {
"mobile": "< 640px",
"tablet": "640px - 1024px",
"desktop": "> 1024px",
"requirements": [
"Do not simply shrink desktop layouts.",
"Adapt navigation for mobile.",
"Convert product grids to fewer columns on smaller screens.",
"Convert filter controls into a drawer or modal on mobile.",
"Stack dashboard cards on mobile.",
"Use a single-column messaging layout on mobile.",
"Make forms full-width and touch-friendly on mobile.",
"Ensure tables have usable responsive alternatives."
]
},
"phase": {
"name": "Phase 01: Frontend Foundation",
"objective": "Create the frontend application structure, visual system, routing foundation, authentication screens, layouts, reusable components, and realistic frontend states required for later API integration.",
"do_not": [
"Implement Laravel",
"Implement MySQL",
"Implement real authentication",
"Implement real email verification",
"Implement real API calls",
"Implement backend business logic"
]
},
"pages": {
"public": [
{
"route": "/",
"purpose": "Landing/marketplace introduction and primary navigation into the application"
},
{
"route": "/login",
"purpose": "Student and Admin login interface"
},
{
"route": "/register",
"purpose": "University student registration interface"
},
{
"route": "/verify-email",
"purpose": "Email verification state/interface"
},
{
"route": "/forgot-password",
"purpose": "Password reset request interface"
},
{
"route": "/reset-password",
"purpose": "Password reset interface"
}
],
"student": [
{
"route": "/products",
"purpose": "Marketplace browsing, search, filtering and sorting"
},
{
"route": "/products/:id",
"purpose": "Product details"
},
{
"route": "/favorites",
"purpose": "Saved products"
},
{
"route": "/dashboard",
"purpose": "Student dashboard overview"
},
{
"route": "/dashboard/listings",
"purpose": "Student's product listings"
},
{
"route": "/dashboard/requests",
"purpose": "Sent and received purchase requests"
},
{
"route": "/dashboard/favorites",
"purpose": "Student favorites"
},
{
"route": "/dashboard/messages",
"purpose": "Conversations and message history"
},
{
"route": "/dashboard/profile",
"purpose": "Student profile"
},
{
"route": "/products/create",
"purpose": "Create product listing"
},
{
"route": "/products/:id/edit",
"purpose": "Edit owned product"
}
],
"admin": [
{
"route": "/admin",
"purpose": "Admin dashboard"
},
{
"route": "/admin/users",
"purpose": "User management"
},
{
"route": "/admin/products",
"purpose": "Product management"
},
{
"route": "/admin/categories",
"purpose": "Category management"
},
{
"route": "/admin/reports",
"purpose": "Report management"
},
{
"route": "/admin/analytics",
"purpose": "Basic statistics and analytics"
}
]
},
"authentication_ui": {
"login": {
"fields": [
"University Email",
"Password"
],
"actions": [
"Login",
"Forgot Password",
"Go to Register"
]
},
"register": {
"fields": [
"Name",
"University Email",
"Password",
"Confirm Password"
],
"requirements": [
"Clearly indicate that only the selected university's email is accepted.",
"Include client-side validation.",
"Include loading state.",
"Include validation error state.",
"Include success state."
]
},
"verification": {
"requirements": [
"Show verification-required state.",
"Provide resend verification UI.",
"Provide clear success and error states."
]
},
"password_reset": {
"requirements": [
"Forgot password form.",
"Reset password form.",
"Success state.",
"Validation state."
]
}
},
"student_dashboard": {
"overview_cards": [
"My Listings",
"Pending Requests",
"Accepted Requests",
"Favorites"
],
"sections": [
"Recent Listings",
"Recent Requests",
"Recent Messages"
],
"navigation": [
"Marketplace",
"Favorites",
"Messages",
"Dashboard",
"Profile",
"Logout"
]
},
"marketplace": {
"search": {
"placeholder": "Search products..."
},
"filters": [
"Category",
"Price Range",
"Condition",
"Location"
],
"sorting": [
"Newest",
"Oldest",
"Lowest Price",
"Highest Price"
],
"product_card": [
"Product Image",
"Product Name",
"Price",
"Category",
"Condition",
"Location",
"Status",
"Favorite Action",
"View Product Action"
]
},
"product_details": {
"sections": [
"Product Image",
"Product Information",
"Description",
"Seller Information",
"Location",
"Contact Information"
],
"actions": [
"Save/Unsave",
"Request to Buy",
"Message Seller",
"Report"
],
"states": [
"Available",
"Sold"
],
"rules": [
"Request to Buy should be visually disabled or unavailable when the product is Sold.",
"The current user's own product should not display a Request to Buy action.",
"Admin views should not expose student-only purchase actions."
]
},
"product_form": {
"fields": [
"Product Name",
"Description",
"Price",
"Category",
"Condition",
"Product Image",
"Location",
"Contact Information"
],
"actions": [
"Create Listing",
"Save Changes",
"Cancel"
],
"states": [
"Default",
"Editing",
"Submitting",
"Success",
"Validation Error",
"Server Error"
]
},
"favorites": {
"actions": [
"Save",
"Unsave"
],
"empty_state": "No saved products yet."
},
"requests": {
"sent": {
"fields": [
"Product",
"Seller",
"Status",
"Date"
],
"statuses": [
"Pending",
"Accepted",
"Rejected"
]
},
"received": {
"fields": [
"Product",
"Buyer",
"Status",
"Date"
],
"actions": [
"Accept",
"Reject"
]
},
"status_flow": "Pending → Accepted or Rejected",
"product_flow": "Available → Sold after seller accepts a request"
},
"messaging": {
"desktop": "Two-panel conversation layout",
"mobile": "Single-column conversation layout",
"features": [
"Conversation list",
"Conversation details",
"Message history",
"Message input",
"Send message"
],
"do_not_implement": [
"WebSockets",
"Socket.io",
"Typing indicators",
"Read receipts",
"Voice messages",
"Video calls",
"Message reactions"
],
"mock_behavior": "Use local mock state or static mock data only for UI demonstration. Keep the code structured so Axios/Laravel API integration can replace the mock layer later."
},
"reporting": {
"targets": [
"Product",
"User"
],
"form_fields": [
"Reason",
"Additional Description"
],
"reasons": [
"Spam",
"Inappropriate Content",
"Misleading Listing",
"Suspicious User",
"Other"
],
"states": [
"Pending",
"Resolved"
]
},
"admin": {
"navigation": [
"Dashboard",
"Users",
"Products",
"Categories",
"Reports",
"Analytics",
"Profile",
"Logout"
],
"dashboard_statistics": [
"Total Users",
"Total Products",
"Available Products",
"Sold Products",
"Total Requests",
"Total Reports",
"Total Categories"
],
"users": [
"View",
"Block",
"Delete"
],
"products": [
"View",
"Delete"
],
"categories": [
"Create",
"View",
"Edit",
"Delete"
],
"reports": [
"View",
"Resolve",
"Remove Product",
"Block User"
]
},
"component_architecture": {
"layout": [
"AppLayout",
"StudentLayout",
"AdminLayout",
"Navbar",
"Footer",
"Sidebar"
],
"ui": [
"Button",
"Input",
"Select",
"Textarea",
"Modal",
"Badge",
"Alert",
"EmptyState",
"LoadingState",
"ErrorState"
],
"marketplace": [
"ProductCard",
"ProductGrid",
"SearchBar",
"FilterPanel",
"SortSelect",
"ProductForm"
],
"requests": [
"RequestCard",
"RequestStatus"
],
"messaging": [
"ConversationList",
"ConversationItem",
"MessageList",
"MessageInput"
],
"admin": [
"StatCard",
"DataTable",
"UserTable",
"ProductTable",
"ReportTable"
]
},
"frontend_architecture": {
"recommended_structure": [
"src/components",
"src/pages",
"src/layouts",
"src/hooks",
"src/contexts",
"src/services",
"src/types",
"src/utils",
"src/assets"
],
"requirements": [
"Keep components focused.",
"Avoid giant components.",
"Keep API service definitions separate from UI components.",
"Create TypeScript interfaces/types for expected API resources.",
"Keep mock data separate from production API service code.",
"Use reusable components rather than duplicated page-specific components."
]
},
"api_boundary": {
"instruction": "Do not implement backend APIs.",
"future_resource_groups": [
"/auth",
"/users",
"/products",
"/categories",
"/favorites",
"/requests",
"/conversations",
"/messages",
"/reports",
"/admin"
],
"frontend_preparation": [
"Create typed API service interfaces where useful.",
"Create a centralized Axios configuration only if needed for the frontend foundation.",
"Use mock data for UI demonstration.",
"Do not invent backend response structures beyond the approved documentation."
]
},
"states": {
"every_async_feature": [
"Loading",
"Success",
"Empty",
"Error"
],
"forms": [
"Default",
"Focused",
"Invalid",
"Submitting",
"Success",
"Error",
"Disabled"
],
"instruction": "Every important interaction must visibly communicate its current state."
},
"accessibility": {
"requirements": [
"Use semantic HTML.",
"Provide labels for form fields.",
"Provide accessible button labels.",
"Maintain visible focus states.",
"Use meaningful alt text for product images.",
"Ensure keyboard navigation works.",
"Ensure sufficient text contrast.",
"Associate validation errors with their fields."
]
},
"animation": {
"allowed": [
"Subtle page transitions",
"Button hover",
"Card hover",
"Modal entrance",
"Loading indicators"
],
"avoid": [
"Heavy animation",
"3D effects",
"Continuous background animation",
"Excessive parallax",
"Distracting motion"
]
},
"dependencies": {
"allowed": [
"React",
"TypeScript",
"Vite",
"React Router",
"Axios",
"Tailwind CSS"
],
"rule": "Do not add new dependencies unless they are clearly necessary for the approved frontend requirements. Prefer native React functionality and existing dependencies."
},
"mock_data": {
"instruction": "Because this is the frontend-only phase, create realistic local mock data sufficient to demonstrate all approved UI states.",
"include": [
"Students",
"Admin",
"Categories",
"Available Products",
"Sold Products",
"Favorites",
"Pending Requests",
"Accepted Requests",
"Rejected Requests",
"Conversations",
"Messages",
"Reports",
"Dashboard Statistics"
],
"important": "Clearly separate mock data from future API integration. Do not make mock data look like a permanent backend implementation."
},
"quality_requirements": {
"must_check": [
"TypeScript compilation",
"Build errors",
"Routing errors",
"Broken imports",
"Missing components",
"Responsive layout",
"Console errors",
"Visual inconsistencies",
"Form states",
"Empty states",
"Loading states",
"Error states"
],
"instruction": "Before completing the frontend phase, run the application locally and verify the implemented pages and primary navigation flows."
},
"implementation_order": [
"Inspect project and existing files",
"Initialize or preserve React + TypeScript + Vite structure",
"Configure Tailwind CSS",
"Create global design tokens and reusable UI components",
"Create application layouts",
"Create routing structure",
"Create authentication pages",
"Create student dashboard",
"Create admin dashboard",
"Create marketplace UI",
"Create product details UI",
"Create product forms",
"Create favorites UI",
"Create request management UI",
"Create messaging UI",
"Create reporting UI",
"Create admin management pages",
"Add responsive behavior",
"Add loading, empty, error and success states",
"Add mock data",
"Run build and local verification",
"Fix only frontend issues discovered during verification"
],
"final_instruction": "Build the Campus Exchange frontend as a clean, complete, responsive educational application. Follow the approved documents exactly. Keep the implementation simple. Do not implement backend logic. Do not expand the scope. Do not introduce unnecessary dependencies. Prepare the frontend so the Laravel REST API can be integrated later without restructuring the UI architecture."
}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0c7c464-4641-4ae5-ab87-6db2755ea757).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
