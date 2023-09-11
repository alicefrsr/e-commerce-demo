# e-commerce-demo

> Fullstack e-commerce built with MERN stack & Redux, following Brad Traversy's ProShop tutorial.

Built to learn: Redux for React state management, implementing a backend server with Express, setting up a database with MongoDB.

### Functionalities / Features:

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

#### User:
Log in/out, search for products, place order, pay (Paypal), view orders, view and update profile, write product reviews.

#### Admin:
When logged in as admin, user can add and update products, update users and orders, mark ordered as delivered.

### Requirements

Node v14.6+ or you will need to add the "--experimental-modules" flag.

### Env Variables

Create a .env file in the root folder and add the following:

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = your paypal client id
```

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Scripts

```
# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Logins

admin@example.com (Admin)
123456

john@example.com (Customer)
123456

jane@example.com (Customer)
123456
```

## License

The MIT License
Copyright (c) 2020 Traversy Media https://traversymedia.com
