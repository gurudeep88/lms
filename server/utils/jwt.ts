import { Response } from "express";
import { ITokenOptions, IUser } from "../interface/user.interface";
import { DEFAULT_ACCESS_TOKEN_EXPIRE, DEFAULT_REFRESH_TOKEN_EXPIRE } from "../config/default.config";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/port.config";
import { ACCESS_TOKEN_SECRET, NODE_ENV, REFRESH_TOKEN_SECRET } from "../config";
import { httpResponse } from "../helper/api";
import { redis } from "../database/redis";
import { LMS_ACCESS_TOKEN, LMS_REFRESH_TOKEN } from "../constants/cookie.constant";
import jwt from 'jsonwebtoken';
import { setCookie } from "./cookie.utils";
import { MINUTE_TO_MILLISECONDS } from "../constants";

export const sendToken = (res: Response, user: IUser, statusCode: number) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    // upload session to redis
    redis.set(user._id as string, JSON.stringify(user));
    // only set secure to true in production
    if(NODE_ENV === 'production'){
        accessTokenOptions.secure = true;
    } 
    setCookie(res, LMS_ACCESS_TOKEN, accessToken, accessTokenOptions);
    setCookie(res, LMS_REFRESH_TOKEN, refreshToken, refreshTokenOptions);

    return httpResponse(res, statusCode, {success: true, user, accessToken});
}

    // parse env variables to integrate with fallback values
export const accessTokenExpire = ACCESS_TOKEN_EXPIRE || DEFAULT_ACCESS_TOKEN_EXPIRE;
export const refreshTokenExpire = REFRESH_TOKEN_EXPIRE || DEFAULT_REFRESH_TOKEN_EXPIRE;

export const tokenExpiresForCookie = (tokenExpiresAt: number): Date => {
    return new Date(Date.now() + tokenExpiresAt * MINUTE_TO_MILLISECONDS)
}

export const maxTokenAgeForCookie = (tokenExpiresAt: number) => {
    return tokenExpiresAt * MINUTE_TO_MILLISECONDS;
}


// options for cookies
export const accessTokenOptions: ITokenOptions = {
    expires: tokenExpiresForCookie(accessTokenExpire),
    maxAge: maxTokenAgeForCookie(accessTokenExpire),
    httpOnly: true,
    sameSite: 'lax'
}

export const refreshTokenOptions: ITokenOptions = {
    expires: tokenExpiresForCookie(refreshTokenExpire),
    maxAge: maxTokenAgeForCookie(refreshTokenExpire),
    httpOnly: true,
    sameSite: 'lax'
}


export const signJwtToken = (payload: any, secret: string, options: any) => {
    return jwt.sign(
        payload, 
        secret, 
        options
    )
}

export const signAccessToken = (payload: { id: string}) => {
    return signJwtToken(
        payload, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: ACCESS_TOKEN_EXPIRE * MINUTE_TO_MILLISECONDS }
    )
}

export const signRefreshToken = (payload: { id: string}) => {
    return signJwtToken(
        payload, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRE * MINUTE_TO_MILLISECONDS }
    )
}