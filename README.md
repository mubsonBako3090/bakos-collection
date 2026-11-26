# Bako's Collection

A Next.js 14 (App Router) store with MongoDB, cookie-based JWT login, a server-side cart,
orders, and an admin area for products and orders. Prices are in Naira (₦).

## Setup

Requires Node 20.6+.

```bash
npm install
cp .env.example .env.local      # then fill in MONGODB_URI and JWT_SECRET
npm run seed                    # adds sample products (safe to re-run)
npm run dev
```

Generate a secret with `openssl rand -base64 48`.

### Create an admin
1. Register an account on the site.
2. `npm run make-admin -- you@example.com`
3. Log in again. An **Admin** link appears in the navbar (`/admin`).

## How it works
- **Auth:** `/api/auth/login` sets an httpOnly `token` cookie. The role is read from the database on every admin request.
- **Cart:** stored per user in MongoDB (`carts`). Only product IDs and quantities are saved; names and prices always come from `products`.
- **Orders:** `POST /api/orders` builds the order from the saved cart on the server. The browser only sends shipping details.
- **Categories:** defined once in `src/lib/categories.js`.

## Not included yet
Online payment, password reset, email verification, login rate limiting, product detail pages, image upload (admin enters an image path/URL).
