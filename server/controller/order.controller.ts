import { NextFunction, Request, Response } from "express";
import ejs from 'ejs';
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { createError } from "../helper/error";
import { IOrder } from "../interface/order.interface";
import { Course, Notification, User } from "../model";
import { COURSE_ALREADY_PURCHASED, COURSE_NOT_FOUND } from "../constants/http.constant";
import { createNewOrder } from "../services/order.service";
import path from "path";
import { APP_NAME } from "../config";
import { sendEmail } from "../helper/sendEmail";
import { httpResponse } from '../helper/api';
import { createNotification } from "../services/notification.service";

export const createOrder = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, paymentInfo } = req.body as IOrder;
        const user = await User.findById(req.user?._id);
        const courses = user?.courses;
        const isCourseExistedInUser = courses?.some((course: any) => course._id.toString() === courseId);
        if(isCourseExistedInUser){
            return next(createError(COURSE_ALREADY_PURCHASED, 409));
        }
        const course = await Course.findById(courseId);
        if(!course){
            return next(createError(COURSE_NOT_FOUND, 409));
        }
        
        const data: any = {
            courseId: course._id,
            userId: user?._id,
            paymentInfo
        }
        const mailData = {
            order: {
                _id: course._id?.toString().slice(0,6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
            },
            appName: APP_NAME
        }
        const html = await ejs.renderFile(path.join(__dirname, '../template/email/order.ejs'), mailData);
        try {
            if(user){
                await sendEmail({
                    email: user.email,
                    subject: APP_NAME + " | Order Confirmation",
                    template: "order.ejs",
                    data: mailData
                });
            }
        } catch (error: any) {
            return next(createError(error.message, 500));
        }
        
        user?.courses?.push(course?._id as { courseId: string; } );
        if(course.purchased !== undefined) {course.purchased += 1 };
        await course.save();
        await user?.save();

        const notificationData: any = {
            user: user?._id,
            title: "New Order",
            message: `You have a new Order from the course - ${course?.name}`
        }
        createNotification(notificationData, res, next);
        // await Notification.create({
        //     user: user?._id,
        //     title: "New Order",
        //     message: `You have a new Order from the course - ${course?.name}`
        // })
        createNewOrder(data, res, next);
    } catch (error: any) {
        return next(createError(error.message, 500));
    }
})