# Phase 5 QA Report: Campus Exchange

## Executive Summary

This report aggregates the findings of a static code analysis audit and direct API review for the Campus Exchange platform. Automated browser UI testing was blocked due to an unresolvable Playwright driver CDN issue, so this audit relies on a deep-dive inspection of the backend logic, API contracts, environment configurations, and frontend-backend alignment.

## 1. Critical Errors & Security Issues

- **Mass Assignment Vulnerability (Critical)**
  - **Location:** `backend/app/Models/User.php`
  - **Issue:** The `role` and `status` attributes are in the `$fillable` array. A malicious user could send `{"role": "admin", "status": "active"}` during registration or profile update and escalate their privileges.
  - **Recommended Fix:** Remove `role` and `status` from `$fillable`. Assign these server-side only.

- **Missing Server-Side Email Verification (Critical)**
  - **Location:** `backend/app/Http/Controllers/AuthController.php`
  - **Issue:** The `register` method creates the user and immediately issues an API token without triggering an email verification event (`event(new Registered($user))`). The API middleware does not enforce the `verified` middleware.
  - **Recommended Fix:** Implement `MustVerifyEmail` on the User model. Dispatch the registration event and add the `verified` middleware to protected routes.

- **Storage Leak on Deletion (Medium)**
  - **Location:** `backend/app/Http/Controllers/ProductController.php` & `AdminController.php`
  - **Issue:** When a `Product` is deleted or a `User` is deleted, their associated images in `storage/app/public/products` or `profiles` are not deleted from the disk.
  - **Recommended Fix:** Hook into the `deleting` model event or explicitly call `Storage::disk('public')->delete($model->image)` before deleting the model.

## 2. API Mismatches

- **Email Verification Flow**
  - **Location:** `frontend/src/routes/register.tsx` vs `backend/api.php`
  - **Issue:** The frontend routes users to `/verify-email` and explicitly tells them to check their inbox. The backend provides no endpoint for email verification and does not send the email.
  - **Severity:** High (Broken User Flow)

- **Admin Deletion Route vs Soft Deletes**
  - **Location:** `backend/app/Http/Controllers/AdminController.php`
  - **Issue:** `deleteUser` uses `$user->delete()`. Since the User model uses `SoftDeletes`, the user is not permanently deleted, but the frontend might expect a hard delete.

## 3. Performance Issues

- **Missing Pagination & N+1 Queries**
  - **Location:** `backend/app/Http/Controllers/ProductController.php`, `AdminController.php`
  - **Issue:** `Product::query()->get()` and `User::all()` are used on endpoints that return collections. As the database grows, this will cause massive memory bloat and slow down the API. Furthermore, relationships (like `category`, `user`) are not eager-loaded (`with()`), leading to N+1 query problems in the Resource mapping.
  - **Recommended Fix:** Replace `->get()` and `::all()` with `->paginate(15)`. Use `->with(['category', 'user'])`.

## 4. Environment & Database Issues

- **Misconfigured DB_DATABASE in `.env`**
  - **Location:** `backend/.env` & `backend/storage/logs/laravel.log`
  - **Issue:** The system previously threw `SQLiteDatabaseDoesNotExistException` indicating that before migrating to MySQL, the `campus-exchange` SQLite file was missing. Currently, it relies on MySQL `campus_exchange`, but the `.env.example` or defaults might be out of sync.
  - **Recommended Fix:** Ensure standard `.env` configuration is documented.

## 5. Authorization Errors

- **Hardcoded Authorization Checks**
  - **Location:** `ProductController.php` (update/destroy), `PurchaseRequestController.php`
  - **Issue:** Uses inline checks like `if ($request->user()->id !== $product->user_id && $request->user()->role !== 'admin')`.
  - **Severity:** Medium (Maintainability)
  - **Recommended Fix:** Implement Laravel Policies (e.g., `ProductPolicy`) and use `$this->authorize('update', $product)`.

## 6. Frontend / Build Issues

- **Playwright Configuration (Environment Issue)**
  - **Location:** Automated test suite
  - **Issue:** Automated e2e tests fail to initialize due to a `404 Not Found` error when fetching the Playwright windows driver (`playwright-1.57.0-win32_x64.zip`) from Azure CDNs.
  - **Recommended Fix:** Update `@playwright/test` to a stable version, or bypass the CDN issues by manually providing the driver.

## 7. Workflows Status

### Passed Workflows (Backend Logic Verified)

- Product creation (with image upload)
- Standard Login / Token generation
- Purchase request creation and transition logic (Available -> Pending -> Sold / Rejected)

### Failed Workflows

- **Registration to Verification:** Fails because backend email dispatch is missing.
- **Admin Privilege Escalation:** Registration workflow allows hackers to assign themselves as Admin (Security Failure).

## 8. Remaining Tasks

1. Refactor `User.php` `$fillable` array.
2. Implement standard Laravel Email Verification.
3. Apply `paginate()` and eager loading `with()` to all listing endpoints.
4. Convert inline authorization checks to Laravel Policies.
5. Setup an Event Listener or Model Observer to prune orphaned images.
6. Fix Playwright driver CDN issue to re-enable automated browser UI testing.
