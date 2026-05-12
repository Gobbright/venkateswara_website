# Venkateswara Backend

Node, Express, and MongoDB backend scaffold for Sri Venkateswara Family Shop.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## API

- `GET /api/health` - server and database status
- `GET /api/auth/demo-admins` - list seeded demo admin users
- `GET /api/auth/users` - list registered customer users
- `POST /api/auth/register` - register customer in MongoDB
- `POST /api/auth/login` - customer login from MongoDB
- `POST /api/auth/admin/login` - admin login from MongoDB
- `GET /api/auth/me` - get logged-in user profile
- `PUT /api/auth/me` - update logged-in user name and phone
- `GET /api/products` - list products
- `POST /api/products` - create product
- `GET /api/categories` - list categories
- `POST /api/categories` - create category
- `POST /api/enquiries` - create enquiry
