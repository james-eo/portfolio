import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/user.model';

// Protect routes - admin only
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  // check if token is in header or cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Record<string, unknown>;

    const user = await User.findById(decoded.id);
    req.user = user ?? undefined;

    if (!req.user) {
      return next(new ErrorResponse('No user found with this token', 401));
    }

    // Check if user is admin - this is the key addition for your requirement
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin privileges required.', 403));
    }

    next();
  } catch {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Optional auth - doesn't fail if no token
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Record<string, unknown>;
        const user = await User.findById(decoded.id);
        req.user = user ?? undefined;
      } catch {
        // Continue without user if token is invalid
        req.user = undefined;
      }
    }

    next();
  }
);

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorResponse('User not found', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
