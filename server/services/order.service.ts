import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { Order } from "../model";
import { httpResponse } from "../helper/api";
import { getSortedModelFields } from "./index.service";
import { SUCCESS } from "../constants";

export const createNewOrder = CatchAsyncError(async(data: any, res: Response, next: NextFunction) => {
   const order = await Order.create(data);

    return httpResponse(res, 201, {
        success: true,
        order
    })
})

export const getOrdersService= async(res: Response) => {
    const orders = await getSortedModelFields(Order);
    return httpResponse(res, 200, orders, SUCCESS);
}