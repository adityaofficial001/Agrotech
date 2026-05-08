# Agrotech Backend API

This is the fully functional REST API backend for the Agrotech (Vardhman) frontend application. Built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Database Setup:**
   Ensure you have PostgreSQL running. Update the `.env` file with your connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/agrotech?schema=public"
   PORT=5000
   JWT_SECRET="supersecret_jwt_key_please_change_in_production"
   JWT_EXPIRES_IN="7d"
   ```

3. **Run Prisma Migrations:**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   # Ensure dev script in package.json runs: ts-node-dev src/server.ts 
   # Or run via ts-node directly: npx ts-node src/server.ts
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create a new user (requires name, email, password)
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current logged in user (Requires Bearer Token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Place a new order (Requires Auth)
- `GET /api/orders/my-orders` - Get current user's orders (Requires Auth)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id` - Update order status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Features Included
- JWT based robust authentication
- Role-based access control (`USER` vs `ADMIN`)
- Zod Request Body Validation (for Auth)
- Comprehensive Global Error Handler
- Prisma ORM strict typings
