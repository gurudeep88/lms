import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { createError } from "../helper/error";
import ejs from 'ejs';
import { createCourse, updateCourse } from "../services/course.service";
import { Course } from "../model";
import { httpResponse } from "../helper/api";
import { PROHIBITED_COURSE_FIELDS } from "../constants/course.constant";
import { redis } from "../database/redis";
import { REDIS_ALL_COURSES_KEY } from "../constants/db.constant";
import { SEVEN_DAYS_TO_SECONDS, SUCCESS } from "../constants";
import { IAddQuestionData, IAddReplyData, IAddReviewData, IAddReviewReplyData, IQuestion, IReview } from "../interface/course.interface";
import { Types } from "mongoose";
import path from "path";
import { APP_NAME } from "../config";
import { sendEmail } from "../helper/sendEmail";
import { createNotification } from "../services/notification.service";
import { CLOUDINARY_FOLDER } from "../constants/cloudinary.constant";
import { uploadToCloudinary } from '../services/cloudinary.service';

export const uploadCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data?.thumbnail;
        if(thumbnail){
            const { public_id, url } = await uploadToCloudinary(thumbnail, CLOUDINARY_FOLDER.Courses);
            data.thumbnail = {
                public_id ,
                url
            }
        }
        createCourse(data, res, next);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const editCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data?.thumbnail;
        if(thumbnail){
            const {public_id, url} = await uploadToCloudinary( thumbnail ,CLOUDINARY_FOLDER.Courses );
            data.thumbnail = {
                public_id,
                url
            }
        }
        if(!req.params.id){
            return next(createError("no id", 400));
        }
        data.courseId= req.params.id;
        updateCourse( data, res, next );
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

//get single course -- without purchase --everyone can take it
export const getCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const isCourseCached = await redis.get(courseId);
        if(isCourseCached){
            const course = JSON.parse(isCourseCached);
            return httpResponse(res, 200, course, SUCCESS);
        }
        const course = await Course.findById(courseId).select(PROHIBITED_COURSE_FIELDS);
        await redis.set(courseId, JSON.stringify(course), 'EX', SEVEN_DAYS_TO_SECONDS);
        httpResponse(res, 200, course, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
});

//get single course -- without purchase --everyone can take it
export const listCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const AreCoursesCached = await redis.get(REDIS_ALL_COURSES_KEY);
        if(AreCoursesCached){
            const courses = JSON.parse(AreCoursesCached);
            return httpResponse(res, 200, courses, SUCCESS);
        }
        const courses = await Course.find().select(PROHIBITED_COURSE_FIELDS);
        await redis.set(REDIS_ALL_COURSES_KEY, JSON.stringify(courses));
        httpResponse(res, 200, courses, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
});

//get course content - only for valid user
export const getCourseContentByUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courseList = req.user?.courses;
        const courseId = req.params.id;

        const isCourseExisted = courseList?.find((course: any) => course._id === courseId);
        if(!isCourseExisted){
            return next(createError("You are not eleigible to access this course", 403));
        }
        const course = await Course.findById(courseId);
        const content = course?.courseData;
        return httpResponse(res, 200, content, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const addQuestion = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId } = req.body as IAddQuestionData;
        const course = await Course.findById(courseId);
        if(!Types.ObjectId.isValid(contentId)){
            return next(createError("Invalid content id", 404));
        }
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));
        if(!courseContent){
            return next(createError("Invalid content id", 404));
        }
        if(!req.user){
            return next(createError("Not authorized", 403));
        }
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        };
        courseContent.questions.push(newQuestion);
        const notificationData: any = {
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question from - ${courseContent?.title}`
        }
        createNotification(notificationData, res, next);
        await course?.save();
        return httpResponse(res, 201, course, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const addReply = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body as IAddReplyData;
        const user = req?.user;
        if(!user){
            return next(createError("Not authorized", 403));
        }
        const course = await Course.findById(courseId);
        if(!Types.ObjectId.isValid(contentId)){
            return next(createError("Invalid content id", 404));
        }
        const courseContent = course?.courseData?.find((content: any) => content._id.equals(contentId));
        if(!courseContent){
            return next(createError("Invalid content id", 404));
        }
        const question = courseContent?.questions?.find((question: any) => question._id.equals(questionId));
        if(!question){
            return next(createError("Invalid question id", 404));
        }
        const newAnswer: any = {
            user: user,
            answer
        }
        question.questionReplies?.push(newAnswer);
        await course?.save();
        if( user?._id === question.user._id ){
            const notificationData: any = {
                user: user?._id,
                title: "New Question Reply Received",
                message: `You have a new question reply from - ${courseContent?.title}`
            }
            createNotification(notificationData, res, next);

        }else{
            const data = {
                name:  question.user.name,
                title: courseContent.title,
                appName: APP_NAME
            }
            const html = await ejs.renderFile(path.join(__dirname, "../template/email/reply.ejs"), data);
            try {
                await sendEmail({
                    email: question.user.email,
                    subject: "Reply from "+APP_NAME,
                    template: "reply.ejs",
                    data
                });
            } catch (error: any) {
                return next(createError(error.message, 400));
            }
        }
        return httpResponse(res, 200, course, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const addReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req?.user;
        if(!user){
            return next(createError("Not authorized", 403));
        }
        const userCourseList = user?.courses as any;
        const courseId = req.params?.id;
        const isCourseExisted = userCourseList?.some((course: any) => course._id === courseId);
        if(!isCourseExisted){
            return next(createError("You are not eligible to access this course", 403));
        }
        const course = await Course.findById(courseId);
        if(!course){
            return next(createError("Course not found", 404));
        }
        const reviews = course?.reviews as IReview[];
        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user,
            rating,
            comment: review
        }
        reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((rev: IReview) => {
            avg += rev.rating
        });
        course.ratings = avg / reviews?.length;  
        await course.save();

        const notification: any = {
            user: user._id,
            title: "New Review Received",
            message: `${user.name} has given a review on your course of ${course.name}`
        }

        createNotification(notification, res, next);

        return httpResponse(res, 200, course, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const addReviewReply = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try{
        const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
        const course = await Course.findById(courseId);
        if(!course){
            return next(createError("Course not found", 404));
        }   
        const reviews = course.reviews;
        const review = reviews?.find((review: IReview) => (review._id as string).toString() === reviewId);
        if(!review){
            return next(createError("Review not found", 404));
        }
        const reviewReplyData: any = {
            user: req.user,
            comment
        };
        if(!review.commentReplies){
            review.commentReplies = [];
        }
        review.commentReplies?.push(reviewReplyData);
        await course.save();
        return httpResponse(res, 200, course, SUCCESS);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})