import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { getOrdersService } from "../../services/order.service";
import { createError } from "../../helper/error";

export const listOrders = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        return await getOrdersService(res);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})