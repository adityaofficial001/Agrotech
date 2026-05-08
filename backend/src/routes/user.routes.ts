import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .delete(deleteUser);

export default router;
