import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { catchAsync } from '../utils/catchAsync';
import { signToken } from '../utils/jwt';
import AppError from '../utils/AppError';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone
    }
  });

  const token = signToken(user.id, user.role);

  // remove password from output
  user.password = undefined as any;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user.id, user.role);

  user.password = undefined as any;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
