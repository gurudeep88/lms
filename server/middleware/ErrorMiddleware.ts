import { Request, NextFunction, Response } from "express";
import { ERROR_MESSAGE, ERROR_STATUS_CODE, RESOURCE_NOT_FOUND } from "../constants/error";
import { WRONG_MONGODB_ID_ERROR } from "../constants/error";
import { createError } from "../helper/error";
import { httpResponse } from "../helper/api";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || ERROR_STATUS_CODE;
    err.message =  err.message || ERROR_MESSAGE;

    //wrong mongodb id error
    if(err.name === WRONG_MONGODB_ID_ERROR ||  err.errorName === WRONG_MONGODB_ID_ERROR){
        const message = `${RESOURCE_NOT_FOUND}. Invalid ${err.path}`;
        err = createError(message, 400);
    }
    //Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = createError(message, 400);
    }
    //wrong jwt token error
    if(err.name === 'JsonWebTokenError'  || err.errorName === 'JsonWebTokenError'){
        const message = `Json web token is invalid, try again`;
        err = createError(message, 400);
    }
    //JWT expired error
    if(err.name === 'TokenExpiredError' || err.errorName === 'TokenExpiredError'){
        const message = `Json web token is expired, try again`;
        err = createError(message, 400);
    }
    
    httpResponse(res, err.statusCode, {success: false, message: err.message})
}