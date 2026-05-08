import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';

// USER: Create a new order
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { totalAmount, shippingAddress, items } = req.body;
  const userId = (req as any).user.id;

  if (!items || items.length === 0) {
    return next(new AppError('No order items provided', 400));
  }

  // Create Order and OrderItems in a transaction
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      shippingAddress,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      items: true
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// USER: Get my orders
export const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// ADMIN: Get all orders
export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// ADMIN: Update order status
export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});
