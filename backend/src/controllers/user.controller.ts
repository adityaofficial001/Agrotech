import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';

// ADMIN: Get all users
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// ADMIN: Delete user
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await prisma.user.delete({
    where: { id: req.params.id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
