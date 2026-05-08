import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router
  .route('/')
  .post(createOrder)
  .get(restrictTo('ADMIN'), getAllOrders);

router.get('/my-orders', getMyOrders);

router
  .route('/:id')
  .put(restrictTo('ADMIN'), updateOrderStatus);

export default router;
