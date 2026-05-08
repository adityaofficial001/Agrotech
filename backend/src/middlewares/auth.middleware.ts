import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import AppError from '../utils/AppError';
import { prisma } from '../server';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded: any = verifyToken(token);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user to request
    (req as any).user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Invalid token or token has expired', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
