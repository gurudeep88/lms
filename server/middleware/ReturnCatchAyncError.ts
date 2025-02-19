import { NextFunction, Request, Response } from "express";

export const ReturnCatchAsyncError = (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(theFunc(req, res, next)).catch(next);
}