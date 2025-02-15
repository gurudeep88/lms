import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./CatchAsyncError";
import { createError } from "../helper/error";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from "../config";
import { redis } from "../database/redis";
import { LMS_ACCESS_TOKEN } from '../constants/cookie.constant';

export const isAuthenticated = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies[LMS_ACCESS_TOKEN];
    if(!access_token){
        return next(createError("Please login to access this resource!", 401));
    }
    const decodedAccessToken = jwt.verify(access_token, ACCESS_TOKEN_SECRET) as JwtPayload;
    if(!decodedAccessToken){
        return next(createError("Access token is not valid!", 401));
    }
    const user = await redis.get(decodedAccessToken.id);
    if(!user){
        return next(createError("User not found!", 400));
    }
    req.user = JSON.parse(user);
    next();
}) 

//validate user role
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.user?.role && !roles.includes(req.user?.role)){
            return next(createError(`Roles: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next()
    }
}