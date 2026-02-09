import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import ErrorResponse from '@/utils/errorResponse';
import asyncHandler from '@/utils/asyncHandler';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email, and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User with this email already exists', 400));
  }

  // Ensure only admin users can be created through this endpoint
  const userData = {
    name,
    email,
    password,
    role: role || 'admin', // Default to admin role
  };

  const user = await User.create(userData);

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(201).json({
    success: true,
    data: userResponse,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Don't allow password updates through this endpoint
  const { password, ...updateData } = req.body;

  if (password) {
    return next(
      new ErrorResponse(
        'Password cannot be updated through this endpoint. Use /auth/updatepassword instead',
        400
      )
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
    message: 'User updated successfully',
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Prevent admin from deleting themselves
  // Now user._id is properly typed as mongoose.Types.ObjectId
  if (user._id.toString() === req.user!._id.toString()) {
    return next(new ErrorResponse('Admin cannot delete their own account', 400));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'User deleted successfully',
  });
});
