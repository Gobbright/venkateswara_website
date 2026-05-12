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
- `GET /api/products` - list products
- `POST /api/products` - create product
- `GET /api/categories` - list categories
- `POST /api/categories` - create category
- `POST /api/enquiries` - create enquiry
