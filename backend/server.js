import express, { json } from 'express';
import colors from 'colors';
// import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config(); // no need to pass in where the file is located ie dotenv.config({path: './config.env'})
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import path from 'path';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;

// call the connectDB method
connectDB();

// initialise the app
const app = express();

// body parser middleware
app.use(express.json()); // to parse raw json data into js
app.use(express.urlencoded({ extended: true })); // for url encoded data

// cookie parser middleware
app.use(cookieParser());

// routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));

// make uploads folder a static folder
const __dirname = path.resolve(); // set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// to deploy
if (process.env.NODE_ENV === 'production') {
  // npm run build creates a build folder with all static assets --> set it to static folder.
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // any route that is not api (lines 33-36) will be redirected to index.html
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
} else {
  app.get('/', (req, res) => res.send('ProShop API is running...'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow));
