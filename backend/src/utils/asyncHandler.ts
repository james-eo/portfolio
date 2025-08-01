import type { Request, Response, NextFunction } from "express"

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>

const asyncHandler = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
