import type { Request, Response } from 'express';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (err: Error, req: Request, res: Response) => {
  let error: ErrorResponse | Error = { ...err };
  error.message = err.message;

  // Log to console for dev
  // Please remove in production
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if ((err as { code?: number }).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationError = err as unknown as { errors: Record<string, { message: string }> };
    const message = Object.values(validationError.errors).map((val) => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }

  const statusCode =
    error instanceof ErrorResponse && 'statusCode' in error
      ? (error as unknown as { statusCode: number }).statusCode
      : 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
