import express from 'express';
const router = express.Router();
// import products from '../data/products.js';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router
  .route('/') // (= '/api/products')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/top', getTopProducts); // before '/:id'

router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
