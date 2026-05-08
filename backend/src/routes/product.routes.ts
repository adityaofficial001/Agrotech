import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(protect, restrictTo('ADMIN'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, restrictTo('ADMIN'), updateProduct)
  .delete(protect, restrictTo('ADMIN'), deleteProduct);

export default router;
