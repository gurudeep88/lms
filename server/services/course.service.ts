import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { Course } from "../model";
import { httpResponse } from "../helper/api";
import { ReturnCatchAsyncError } from "../middleware/ReturnCatchAyncError";
import { SUCCESS } from "../constants";
import { getSortedModelFields } from "./index.service";
import { redis } from "../database/redis";

export const createCourse = CatchAsyncError(async(data: any, res: Response, next: NextFunction) => {
    const course = await Course.create(data);
    return httpResponse(res, 201, course, SUCCESS);
})

export const updateCourse = CatchAsyncError(async(data: any, res: Response, next: NextFunction) => {
    const courseId = data.courseId;
    delete data[courseId];
    const course = await Course.findByIdAndUpdate(courseId, {
        $set: data,
        }, 
        { new: true }
    );
    return httpResponse(res, 201, course, SUCCESS);
})

export const findCourseByCourseId = ReturnCatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    return await Course.findById(req.params.id);
})


export const getCoursesService= async(res: Response) => {
    const courses = await getSortedModelFields(Course);
    return httpResponse(res, 200, courses, SUCCESS);
}

export const deleteCourseService = async(res: Response, id: string) => {
    await Course.deleteOne({_id: id});
    await redis.del(id);
    return httpResponse(res, 200, {success: true, message: "Course deleted successfully"})
}
