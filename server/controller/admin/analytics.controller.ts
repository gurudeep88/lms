import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { createError } from "../../helper/error";
import { generateLast12MonthsData } from "../../helper/analytics.generator";
import { Course, Order, User } from "../../model";
import { httpResponse } from "../../helper/api";
import { SUCCESS } from "../../constants";

export const getUsersAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try{
        const users = await generateLast12MonthsData(User);
        return httpResponse(res, 200, users, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const getCoursesAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try{
        const courses = await generateLast12MonthsData(Course);
        return httpResponse(res, 200, courses, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const getOrdersAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try{
        const orders = await generateLast12MonthsData(Order);
        return httpResponse(res, 200, orders, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})