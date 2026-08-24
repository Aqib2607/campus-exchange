# Campus Exchange

Campus Exchange is a premium, educational single-university student marketplace. It allows students to buy, sell, and request products within their university ecosystem in a secure, high-end environment.

This project has been recently transformed to feature a **premium editorial aesthetic**, moving away from generic functional layouts toward a visually striking, curated product experience.

## Features

- **Premium UI/UX:** Sharp borders, oversized "Oswald" typography, stark contrast, and an elegant 3-tier motion system.
- **Marketplace Browsing:** Asymmetric product grids with immersive hover states.
- **Product Details:** Split-pane layouts for detailed product inspection.
- **Student Dashboard:** Manage listings, requests, favorites, and profile in a stark, data-driven workspace.
- **Admin Dashboard:** Command center for managing users, products, categories, and moderation reports.
- **Messaging:** Built-in communication tools with a clean, high-end interface for student-to-student transactions.

## Tech Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite (with TanStack Start / Nitro integration)
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **Styling:** Tailwind CSS v4 (with custom utility classes in `frontend/src/styles.css`)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Framework:** Laravel 11
- **Language:** PHP 8.2+
- **Database:** MySQL / SQLite (for local development)

## Development Setup

The project is structured with a distinct frontend and backend architecture. The frontend is bundled via Vite and synchronized to Laravel's public directory.

### 1. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend Setup

In a new terminal window, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

### 3. Production Build

To build the frontend and automatically synchronize the assets to the Laravel backend public directory, run:

```bash
cd frontend
npm run build
```

The `postbuild.mjs` script will take care of moving the generated assets to `backend/public/frontend` and creating the necessary `index.html` integration point for Laravel.

## Design Philosophy

The UI uses a custom styling architecture defined in `frontend/src/styles.css`.
- **Typography:** Oswald (Display), Inter (Body)
- **Geometry:** Sharp corners (`rounded-none`), heavy grid lines, and stark borders.
- **Motion:** `transition-fast`, `transition-medium`, `transition-slow` utilities utilizing cubic-bezier curves for elegant micro-interactions.

## License
This project is built for educational purposes.
