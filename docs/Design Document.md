# Design Document

## 1. Design Overview

Campus Exchange should have a clean, modern, student-friendly marketplace interface.

The design should feel like a university community platform rather than a commercial e-commerce website.

Primary goals:

* Simple navigation.
* Clear product discovery.
* Easy listing creation.
* Strong readability.
* Responsive layouts.
* Consistent components.
* Minimal unnecessary animation.
* Clear distinction between Student and Admin interfaces.

The design should remain practical for an educational project and should not introduce unnecessary visual complexity.

---

## 2. Design Direction

## Visual Style

Recommended direction:

* Modern
* Clean
* Minimal
* Friendly
* Academic
* Slightly youthful

The interface should prioritize usability over visual effects.

Avoid:

* Excessive gradients.
* Excessive 3D elements.
* Heavy animations.
* Complex dashboard visualizations.
* Overly dense layouts.
* Commercial marketplace-style promotional sections.

---

## 3. Color System

Use a simple consistent color system.

| Purpose        | Color     |
| -------------- | --------- |
| Primary        | `#2563EB` |
| Primary Hover  | `#1D4ED8` |
| Secondary      | `#0F172A` |
| Background     | `#F8FAFC` |
| Surface        | `#FFFFFF` |
| Primary Text   | `#0F172A` |
| Secondary Text | `#64748B` |
| Border         | `#E2E8F0` |
| Success        | `#16A34A` |
| Warning        | `#F59E0B` |
| Error          | `#DC2626` |

The palette should remain consistent across Student and Admin interfaces.

---

## 4. Typography

Use a modern sans-serif font.

Recommended:

* Inter
* Poppins
* Geist

A single primary font family should be used throughout the application.

### Suggested hierarchy

| Element    |       Size |     Weight |
| ---------- | ---------: | ---------: |
| H1         | 36 to 48px |        700 |
| H2         | 28 to 36px |        700 |
| H3         | 20 to 24px |        600 |
| Body       |       16px |        400 |
| Small text |       14px |        400 |
| Button     | 14 to 16px | 500 to 600 |

Mobile typography should scale down appropriately.

---

## 5. Layout System

Use a centered responsive container.

Recommended maximum width:

`1200px`

Desktop structure:

```text
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│            Main Content             │
│                                     │
└─────────────────────────────────────┘
```

The application should use consistent:

* Margins.
* Padding.
* Card spacing.
* Section spacing.
* Form spacing.

---

## 6. Responsive Design

The application must support:

* Desktop.
* Tablet.
* Mobile.

Recommended breakpoints:

```text
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

Mobile layouts should not simply shrink desktop content.

Components should adapt structurally.

Examples:

* Desktop navigation becomes a mobile menu.
* Product grids reduce columns.
* Sidebar filters become a filter button/drawer.
* Dashboard cards stack vertically.
* Tables become responsive layouts.
* Messaging panels become single-column views.

---

## 7. Navigation

## Student Navigation

Recommended structure:

```text
Logo
Marketplace
Favorites
Messages
Dashboard
Profile
Logout
```

The navigation should remain simple.

The most important destination should be the marketplace.

---

## 8. Admin Navigation

Admin navigation should provide:

```text
Dashboard
Users
Products
Categories
Reports
Analytics
Profile
Logout
```

Admin navigation should be visually distinguishable from normal student navigation.

---

## 9. Home / Marketplace Page

The main marketplace should focus on product discovery.

### Structure

```text
Navbar
   ↓
Page Heading
   ↓
Search Bar
   ↓
Filter / Sort Controls
   ↓
Product Grid
   ↓
Pagination / Load More
```

Avoid a large marketing-style hero section because this is an academic marketplace application.

---

## 10. Product Card

Each product card should display:

* Product image.
* Product name.
* Price.
* Category.
* Condition.
* Location.
* Product status.
* Favorite button.

Example structure:

```text
┌─────────────────────┐
│                     │
│    Product Image    │
│                     │
├─────────────────────┤
│ Product Name        │
│ Category            │
│                     │
│ ৳ Price             │
│ Condition • Location│
│                     │
│ [View Product]  ♡   │
└─────────────────────┘
```

Cards should use consistent dimensions and spacing.

---

## 11. Product Details Page

The product details page should contain:

### Left

* Large product image.
* Additional image area if multiple images are supported.

### Right

* Product name.
* Price.
* Category.
* Condition.
* Location.
* Seller information.
* Status.
* Request button.
* Message seller button.
* Favorite button.
* Report button.

Below the primary information:

* Description.
* Seller information.
* Related product information where useful.

---

## 12. Create Listing Page

The listing form should be simple and organized.

Sections:

### Product Information

* Product name.
* Description.
* Category.
* Condition.
* Price.

### Image

* Upload product image.

### Location

* Campus/location.

### Contact

* Contact information.

### Actions

* Cancel.
* Create Listing.

Use clear validation messages beside or below fields.

---

## 13. Edit Listing

The edit form should reuse the Create Listing component where practical.

Existing product information should be pre-filled.

The student can update permitted information.

---

## 14. Favorites Page

Display saved products using the same Product Card component.

Page structure:

```text
Favorites
   ↓
Saved Product Grid
```

If no favorites exist:

```text
No saved products yet.
```

Provide a clear action to return to the marketplace.

---

## 15. Student Dashboard

The dashboard should be simple rather than enterprise-style.

### Overview Cards

* My Listings.
* Pending Requests.
* Accepted Requests.
* Favorites.

### Main Sections

* Recent listings.
* Recent requests.
* Recent messages.

---

## 16. My Listings

Use a clear table or responsive card layout.

Information:

* Product.
* Price.
* Category.
* Status.
* Created date.
* Actions.

Actions:

* View.
* Edit.
* Delete.

---

## 17. Request Management UI

Students should see two sections:

### Sent Requests

* Product.
* Seller.
* Status.
* Date.

### Received Requests

* Product.
* Buyer.
* Status.
* Date.
* Accept.
* Reject.

Use clear status badges.

Recommended:

* Pending: Warning.
* Accepted: Success.
* Rejected: Error.
* Sold: Neutral or success-oriented status.

---

## 18. Messaging Interface

The messaging UI should use a familiar two-panel desktop layout.

```text
┌──────────────┬──────────────────────────┐
│ Conversations│                          │
│              │      Message History     │
│ User A       │                          │
│ User B       │      Messages            │
│ User C       │                          │
│              │──────────────────────────│
│              │ Message input    Send    │
└──────────────┴──────────────────────────┘
```

On mobile:

```text
Conversation List
        ↓
Conversation
        ↓
Message History
```

No advanced chat effects are required.

---

## 19. Reporting UI

Reporting should use a simple modal or form.

Fields:

* Report reason.
* Additional description.

Example reasons:

* Spam.
* Inappropriate content.
* Misleading listing.
* Suspicious user.
* Other.

The user should receive a clear confirmation after submitting.

---

## 20. Profile Page

The profile page should contain:

* Profile information.
* Contact information.
* Account information.
* Edit button.

Keep it simple.

---

## 21. Admin Dashboard

The Admin dashboard should use simple statistics cards.

Example:

```text
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Users    │ │ Products │ │ Requests │
│   120    │ │    85    │ │    42    │
└──────────┘ └──────────┘ └──────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Available│ │ Sold     │ │ Reports  │
│    60    │ │    25    │ │     8    │
└──────────┘ └──────────┘ └──────────┘
```

Below the cards:

* Recent products.
* Recent reports.
* Basic category statistics.

---

## 22. Admin Users Page

Use a responsive table.

Columns:

* Name.
* Email.
* Role.
* Status.
* Joined date.
* Actions.

Actions:

* View.
* Block.
* Delete.

On mobile, convert each row into a card.

---

## 23. Admin Products Page

Columns:

* Product.
* Seller.
* Category.
* Price.
* Status.
* Date.
* Actions.

Actions:

* View.
* Delete.

---

## 24. Admin Categories Page

Use a simple management interface.

```text
Categories

[ Add Category ]

Books          Edit   Delete
Electronics    Edit   Delete
Clothing       Edit   Delete
```

Avoid complex category hierarchies.

Only one category level is required.

---

## 25. Admin Reports Page

Display:

* Reported item/user.
* Reporter.
* Reason.
* Status.
* Date.
* Actions.

Actions:

* View.
* Resolve.
* Remove listing.
* Block user.

---

## 26. Components

Recommended reusable components:

```text
Layout
├── Navbar
├── Footer
├── Sidebar
│
UI
├── Button
├── Input
├── Select
├── Textarea
├── Modal
├── Badge
├── Alert
├── EmptyState
├── LoadingState
├── ErrorState
│
Marketplace
├── ProductCard
├── ProductGrid
├── SearchBar
├── FilterPanel
├── SortSelect
├── ProductForm
│
Requests
├── RequestCard
├── RequestStatus
│
Messaging
├── ConversationList
├── ConversationItem
├── MessageList
├── MessageInput
│
Admin
├── StatCard
├── DataTable
├── UserTable
├── ProductTable
├── ReportTable
```

---

## 27. Button Design

Use three primary button categories.

### Primary

For important actions:

* Create Listing.
* Request to Buy.
* Accept.
* Save.

### Secondary

For supporting actions:

* Cancel.
* View.
* Edit.

### Destructive

For:

* Delete.
* Block.
* Remove.

Buttons should have:

* Consistent height.
* Clear labels.
* Visible hover state.
* Disabled state.
* Loading state where required.

---

## 28. Cards

Cards should use:

* White background.
* Border.
* Small radius.
* Subtle shadow.
* Consistent padding.

Avoid excessive shadows and decorative effects.

---

## 29. Forms

Forms should:

* Clearly label every field.
* Display validation errors.
* Use appropriate input types.
* Provide loading feedback during submission.
* Prevent duplicate submission.
* Preserve user-entered data after recoverable errors.

---

## 30. Loading States

The application should provide loading states for:

* Product loading.
* Product submission.
* Login.
* Registration.
* Request submission.
* Message sending.
* Admin actions.

Skeleton loaders may be used for product grids.

Simple spinners are sufficient for form actions.

---

## 31. Empty States

Every major collection should have an empty state.

Examples:

### Favorites

“No saved products yet.”

### Listings

“You have not created any listings yet.”

### Messages

“No conversations yet.”

### Requests

“No requests found.”

### Reports

“No reports found.”

Each empty state should provide an appropriate next action where useful.

---

## 32. Error States

The UI should handle:

* API failures.
* Network errors.
* Validation errors.
* Unauthorized access.
* Missing products.
* Deleted products.

Messages should be understandable to students.

Avoid displaying raw backend exceptions.

---

## 33. Responsive Rules

### Mobile

* Single-column product grid.
* Collapsible navigation.
* Filter drawer/modal.
* Full-width forms.
* Stacked dashboard cards.
* Single-column messaging.

### Tablet

* Two-column product grid.
* Compact navigation.
* Responsive dashboard layout.

### Desktop

* Three or four-column product grid depending on width.
* Full navigation.
* Two-panel messaging.
* Dashboard cards in horizontal layout.

---

## 34. Accessibility

The interface should include:

* Proper labels.
* Keyboard-accessible buttons.
* Visible focus states.
* Sufficient text contrast.
* Meaningful button labels.
* Alternative text for product images.
* Accessible form error messages.

---

## 35. Animation Guidelines

Animation should be minimal.

Appropriate:

* Button hover.
* Card hover.
* Modal entrance.
* Page transition.
* Loading indicators.

Avoid:

* Continuous background animation.
* Heavy parallax.
* Excessive motion.
* 3D effects.
* Decorative animations that distract from marketplace functionality.

---

## 36. Design Consistency Rules

All pages should maintain:

* Same typography.
* Same color system.
* Same button styles.
* Same form styles.
* Same spacing system.
* Same card treatment.
* Same responsive behavior.

Components should be reused rather than recreated separately for every page.

---

## 37. Design Principle

The visual priority should be:

```text
Usability
   ↓
Clarity
   ↓
Consistency
   ↓
Visual polish
   ↓
Animation
```

The application should feel complete and professional without appearing unnecessarily complex.

---

## 38. Final Design Definition

Campus Exchange should look like a modern university marketplace.

The visual experience should communicate:

* Trust.
* Simplicity.
* Student community.
* Easy product discovery.
* Clear communication.

The design should support the project's educational purpose and remain straightforward enough to implement with React + TypeScript and Tailwind CSS or standard CSS.
