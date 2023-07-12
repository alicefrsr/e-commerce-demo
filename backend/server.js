import express, { json } from 'express';
import colors from 'colors';
// import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;

// call the connectDB method
connectDB();

// initialise the app
const app = express();

// body parser middleware
app.use(express.json()); // for raw json data
app.use(express.urlencoded({ extended: true })); // for url encoded data

// cookie parser middleware
app.use(cookieParser());

// routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow));
