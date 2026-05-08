import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const products = await prisma.product.findMany();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

export const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newProduct = await prisma.product.create({
    data: req.body
  });

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await prisma.product.delete({
    where: { id: req.params.id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
