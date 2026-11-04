# Inventory Management System

A full-stack inventory management web application built for the Devixo Solutions Web Development Internship (Task 04).

**Live demo:** YOUR-VERCEL-LINK
**GitHub:** https://github.com/hifza18abbas-maker/inventory-system

## Features

**Authentication**
- User registration with input and password validation
- Login and logout using JWT stored in an httpOnly cookie
- Protected dashboard pages and protected API routes
- Passwords hashed with bcrypt

**Inventory (CRUD)**
- Create, read, update and delete products
- Each user only sees and manages their own products

**Dashboard**
- Statistics: total products, total units, low stock items, stock value
- Stock by category chart
- Low stock alerts and recent activity
- Search by product name and filter by category
- Data table with pagination

**Bonus features**
- Product image upload (resized in the browser before saving)
- Search and pagination

**UI/UX**
- Responsive, mobile-friendly layout with sidebar navigation
- Consistent design across all pages

**Security and error handling**
- Server-side input validation
- Protected routes and APIs
- Secrets stored in environment variables
- Clear error messages for users

## Tech Stack

- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Next.js API routes (Node.js)
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT, bcryptjs
- Deployment: Vercel

## Run Locally

1. Clone the repository and install dependencies:
   ```
   npm install
   ```
2. Create a `.env.local` file in the project root:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

## Author

Hifza