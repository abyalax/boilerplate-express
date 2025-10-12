import type { Request, Response, NextFunction } from "express";

export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { method, url } = req;
  console.log(`⚡[runtime]: ${method} request to ${url}`);
  next();
};
