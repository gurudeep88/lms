import { NextFunction, Request, Response } from "express";

export interface IParams {
    req: Request,
    res: Response,
    next: NextFunction
}

export interface IErrorParams extends IParams {
    err: any
}