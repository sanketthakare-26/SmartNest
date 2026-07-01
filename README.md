# SmartNest — Premium Smart Home Solutions Catalog

SmartNest is a premium, full-stack web application designed for showcasing and managing a smart home device catalog. It features a rich, interactive storefront, an advanced admin dashboard, and a customer enquiry management system.

---

## 🌟 Features

### 🏠 Storefront (Public Portal)
- **Premium Hero Section**: Modern, animated header with glassmorphism design and smooth page transitions.
- **Searchable & Filterable Catalog**: Live filtering by text search, price range, product category, partner brand, and sorting preferences.
- **Product Details Page**: Beautifully designed page displaying high-res image galleries, specification tables, related products, and a **Detailed Description** section.
- **Consultancy Booking & Enquiries**: Interactive customer lead forms and floating WhatsApp callback integration.
- **Responsive Architecture**: Pixel-perfect viewports on all screen sizes, from mobile drawers to widescreen monitors.

### 🔐 Admin Dashboard (Private Portal)
- **Advanced Navigation & Styling**: Highly polished color scheme matching the premium user storefront.
- **Quick Data Summary**: Dynamic stat boxes displaying **Total Categories** and **Total Brands** at a glance.
- **Tab-Specific Live Search**:
  - 🔍 **Products tab**: Search by name, brand, or category.
  - 🔍 **Categories tab**: Search by category name, slug, or tagline.
  - 🔍 **Brands tab**: Search by name or slug.
  - 🔍 **Enquiries tab**: Search by customer details, message content, category interest, or status.
- **Product & Inventory Management**: Product CRUD, custom tags (Trending, Top Seller, Featured, New), and custom specification attributes.
- **Category & Brand Management**: Create, update, or remove records with auto-slug generation.
- **Enquiry & Booking Resolution**: Real-time status updates (Pending, Contacted, Completed) and deletion tools.

---

## 🏗️ Project Structure

```text
smartnest/
├── client/                  # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components & layouts
│   │   ├── pages/           # Storefront & Admin pages
│   │   ├── context/         # Auth providers (Admin & User)
│   │   ├── lib/             # API clients & static fallbacks
│   │   └── index.css        # Core styling & design tokens
│   ├── .env                 # Frontend local variables
│   └── package.json
│
├── server/                  # Node.js + Express Backend
│   ├── config/              # MongoDB connection, Cloudinary, Mailer, & Firebase
│   ├── models/              # Mongoose schemas (Product, Enquiry, Category, etc.)
│   ├── controllers/         # API business logic
│   ├── routes/              # Express API routes
│   ├── middleware/          # JWT auth validation & image uploading
│   ├── .env                 # Backend environment variables
│   └── server.js            # Main server entry point
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or a local MongoDB instance)

### 1. Installation

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both directories.

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000

# Add Firebase config below if using custom Firebase auth
```

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
# Add your target database name (e.g. /SmartNest) to store collections in a custom DB:
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/SmartNest?appName=SmartNest

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Config
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run Development Servers

```bash
# Start backend (running on port 5000)
cd server
npm run dev

# Start frontend (running on port 5173)
cd client
npm run dev
```

---

## 🔗 Key API Endpoints

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| **GET** | `/api/health` | Public | Reports server status & Mongoose DB connection state |
| **GET** | `/api/products` | Public | List products (with text search, category/brand filters, pagination) |
| **POST** | `/api/products` | Admin | Create new product |
| **PUT** | `/api/products/:id` | Admin | Update product details or images |
| **DELETE** | `/api/products/:id` | Admin | Delete product |
| **GET** | `/api/categories` | Public | List all categories |
| **POST** | `/api/categories` | Admin | Add new category |
| **POST** | `/api/enquiries` | Public | Submit contact enquiry (sends email & saves to DB) |
| **GET** | `/api/enquiries` | Admin | Fetch all customer enquiries |
| **PUT** | `/api/enquiries/:id` | Admin | Update enquiry status (`Pending` ➔ `Contacted` ➔ `Completed`) |

---

## 🛠️ Database Schema

### Product Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "slug": "String (unique)",
  "shortDescription": "String",
  "description": "String (detailed description)",
  "price": "Number",
  "category": "ObjectId (ref: Category)",
  "brand": "ObjectId (ref: Brand)",
  "specifications": [{"key": "String", "value": "String"}],
  "image": "String (Primary Cloudinary URL)",
  "images": ["String (Gallery Cloudinary URLs)"],
  "tag": "String (Trending / Top Seller / Featured / New)",
  "featured": "Boolean",
  "inStock": "Boolean"
}
```

### Enquiry Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (optional)",
  "phone": "String",
  "message": "String (optional)",
  "category": "String (interested product category)",
  "product": "ObjectId (optional, ref: Product)",
  "status": "String (Pending / Contacted / Completed)"
}
```

---

## 🚀 Production Deployment

1. **Frontend**: Deploy `client/` to Netlify, Vercel, or Hostinger. Configure the `VITE_API_URL` environment variable.
2. **Backend**: Deploy `server/` to Render, Railway, or VPS. Configure `MONGO_URI`, Cloudinary, and Nodemailer settings in the hosting provider's environment settings.
3. **Database Security**: If using MongoDB Atlas, make sure to add `0.0.0.0/0` (or your host's static IP range) to the Network Access whitelist to allow backend server connection.