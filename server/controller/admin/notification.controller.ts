import { NextFunction, Request, Response } from "express";
import cron from 'node-cron';
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { createError } from "../../helper/error";
import { Notification } from "../../model";
import { httpResponse } from "../../helper/api";
import { CRON_MID_NIGHT_TIME_STAMP, SUCCESS } from "../../constants";
import { NOTIFICATION_DEFAULT_STATUS } from "../../constants/notification.constant";
import { NOTIFICATION_NOT_FOUND } from "../../constants/http.constant";
import { getSortedNotifications } from "../../services/notification.service";
import { thirtyDaysAgo } from "../../utils";

// only for admin
export const getNotifications = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await getSortedNotifications(req, res, next);
        return httpResponse(res, 200, notifications, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 500))
    }
})

//only for admin
export const updateNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if(!notification){
            return next(createError(NOTIFICATION_NOT_FOUND, 404))
        }
        notification.status  = NOTIFICATION_DEFAULT_STATUS.Read;
        await notification.save();
        const notifications = await getSortedNotifications(req, res, next);
        return httpResponse(res, 201, notifications, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 500))
    }
})

//only for admin

cron.schedule(CRON_MID_NIGHT_TIME_STAMP, async() => {
    const thirtyDays= thirtyDaysAgo();
    await Notification.deleteMany({
        status: NOTIFICATION_DEFAULT_STATUS.Read, 
        createdAt: {
            $lt: thirtyDays
        }
    });
    console.log('Deleted notifications with read status');
})