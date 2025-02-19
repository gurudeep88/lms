import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { createError } from "../../helper/error";
import { deleteCourseService, getCoursesService } from "../../services/course.service";
import { Course } from "../../model";
import { COURSE_NOT_FOUND } from "../../constants/http.constant";

export const listCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        return await getCoursesService(res);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const deleteCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if(!course){
            return next(createError(COURSE_NOT_FOUND, 404));
        }
        await deleteCourseService(res, id);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})