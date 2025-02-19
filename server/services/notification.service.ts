import { NextFunction, Response } from "express";
import { Notification } from "../model";
import { ReturnCatchAsyncError } from "../middleware/ReturnCatchAyncError";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { getSortedModelFields } from "./index.service";

export const getSortedNotifications = ReturnCatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    return await getSortedModelFields(Notification);
});

export const createNotification = CatchAsyncError(async(data: any, res: Response, next: NextFunction) => {
    await Notification.create({
        user: data._id,
        title: data.title,
        message: data.message
    })
})