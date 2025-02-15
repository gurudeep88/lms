import { Request, Response, NextFunction } from "express";
import ejs from 'ejs';
import { v2 } from 'cloudinary';
import { IActivationRequest, ILoginRequest, IRegistrationBody, ISocialAuthBody, IUpdatePasswordBody, IUpdateProfilePicture, IUpdateUserInfoBody, IUser } from "../interface/user.interface";
import { createError } from "../helper/error";
import { User } from "../model";
import { createActivationToken } from "../utils/user.utils";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import path from "path";
import { sendEmail } from "../helper/sendEmail";
import { ACCESS_TOKEN_SECRET, APP_NAME, REFRESH_TOKEN_SECRET, TOKEN_ACTIVATION_SECRET } from "../config";
import { httpResponse } from "../helper/api";
import jwt, { JwtPayload } from "jsonwebtoken";
import { accessTokenOptions, refreshTokenOptions, sendToken, signAccessToken, signRefreshToken } from "../utils/jwt";
import { LMS_ACCESS_TOKEN, LMS_REFRESH_TOKEN, MINUTES_TO_MILLISECONDS } from "../constants/cookie.constant";
import { MAX_AGE_TO_EMPTY_COOKIE } from "../config/number.constant";
import { redis } from "../database/redis";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/port.config";
import { setCookie } from "../utils/cookie.utils";
import { getUserById } from "../services/user.service";

export const register = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await User.findOne({email});
        if(isEmailExist){
            return next(createError("Email already exists", 400))
        }
        const user: IRegistrationBody = {
            name,
            email,
            password
        }
        const {token, activationCode} = createActivationToken(user);
        const data = {user: { name: user.name}, activationCode, appName: APP_NAME}
        const html = ejs.renderFile(path.join(__dirname, "../template/email/activation.ejs"), data);
        try {
            await sendEmail({
                email: user.email,
                subject: `${APP_NAME}: Activate your account`,
                template: "activation.ejs",
                data,
            })
            return httpResponse(
                res, 201, {
                    success: true,
                    message: `Please check your email: ${user.email} to activate your account!`,
                    activationToken: token
                })
        } catch (error:any) {
            return next(createError(error.message, 400, error.name))
        }
    } catch (error: any) {
        return next(createError(error.message, 400, error.name))
    }
});


export const activateUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction ) => {
    try {
        const { activation_code, activation_token } = req.body as IActivationRequest;
        const newUser: {user: IUser, activationCode: string} = jwt.verify(
            activation_token,
            TOKEN_ACTIVATION_SECRET
        ) as {user: IUser, activationCode: string};
        if(newUser.activationCode !== activation_code){
            return next(createError('Invalid activation code', 400));
        }
        const { name, email, password } = newUser.user;
        const existingUser = await User.findOne({email}); 
        if(existingUser){
            return next(createError('Email already exists', 400));
        }
        const user = await User.create({
            name, email, password
        })
        return httpResponse(res, 201, {success: true});
    } catch (error: any) {
        return next(createError(error.message, 400, error.name))
    }
})

export const login = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;
        if(!email || !password){
            return next(createError("Please enter email and password", 400));
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return next(createError("Invalid email and password", 400));
        }
        const isPasswordMatching = await user.comparePassword(password);
        if(!isPasswordMatching){
            return next(createError("Password is incorrect", 400));
        }
        sendToken(res, user, 200);
    } catch (error: any) {
        return next(createError(error.message, 400, error.name));
    }
}

export const logout = async(req: Request, res: Response, next: NextFunction) => {
    try {
        setCookie(res, LMS_ACCESS_TOKEN, '', { maxAge: MAX_AGE_TO_EMPTY_COOKIE });
        setCookie(res, LMS_REFRESH_TOKEN, '', { maxAge: MAX_AGE_TO_EMPTY_COOKIE });
        const userId = req.user?._id || '';
        redis.del(userId as string)
        httpResponse(res, 200, {success: true, message: "Logged out successfully"})
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
}

export const updateAccessToken = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies[LMS_REFRESH_TOKEN];
        const decodedRefreshToken = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET) as JwtPayload;
        const errorMessage = 'Could not refresh token';
        if(!decodedRefreshToken){
            return next(createError(errorMessage, 400));
        }
        const session = await redis.get(decodedRefreshToken.id);
        if(!session){
            return next(createError(errorMessage, 400));
        }
        const user = JSON.parse(session);
        const accessToken =  signAccessToken({id: user._id});
        const refreshToken = signRefreshToken({ id: user._id });
        req.user = user;
        setCookie(res, LMS_ACCESS_TOKEN, accessToken, accessTokenOptions);
        setCookie(res, LMS_REFRESH_TOKEN, refreshToken, refreshTokenOptions);

        return httpResponse(res, 200, {status: "success", accessToken })
        
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const getUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as string;
        return await getUserById( userId, res );
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const socialAuth = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthBody;
        const user = await User.findOne({email});
        if(!user){
            const newUser = await User.create({name, email, avatar})
            sendToken(res, newUser, 201);
        }else{
            sendToken(res, user, 200);
        }
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const updateUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body as IUpdateUserInfoBody;
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if(email && user){
            const isEmailExist = await User.findOne({email});
            if(isEmailExist){
                return next(createError("Email already exists", 400));
            }
            user.email = email;
        }
        if(name && user){
            user.name =  name; 
        }
        await user?.save();
        await redis.set(userId as string, JSON.stringify(user));
        return httpResponse(res, 204, {
            success: true,
            user
        })
    } catch (error:any) {
        return next(createError(error.message, 400));   
    }
})

export const updatePassword = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePasswordBody;
        if(!oldPassword || !newPassword){
            return next(createError("Please enter old and new password!", 400));   
        }
        const userId = req.user?._id as string;       
        const user = await User.findById(userId).select('+password');
        console.log('suer ', user, req.user, user?.password)
        if(user?.password === undefined){
            return next(createError("Invalid user", 400));   
        }
        console.log('invalid ', user, req.user)
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if(!isPasswordMatch){
            return next(createError("Invalid old password", 400));   
        }
        user.password = newPassword;
        await user.save();
        await redis.set(userId, JSON.stringify(user));
        return httpResponse(res, 204, {
            success: true, 
            user
        })
    } catch (error: any) {
        return next(createError(error.message, 400));   
    }
})

export const updateAvatar = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body as IUpdateProfilePicture;
        if(!avatar){
            return next(createError("Missing avatar", 400));  
        }
        const userId = req.user?._id as string;
        const user = await User.findById(userId);
        if(!user){
            return next(createError("Invalid user", 400));
        }
        const publicId = user?.avatar?.public_id;
        if(publicId){
            await v2.uploader.destroy(publicId);
        }else{
            const cloud = await v2.uploader.upload(avatar, {
                folder: "avatars",
                width: 150
            });
            user.avatar = {
                public_id: cloud.public_id,
                url: cloud.secure_url
            }
        }
        await user.save();
        await redis.set(userId, JSON.stringify(user));
        return httpResponse(res, 200, {
            success: true,
            user
        })
    } catch (error: any) {
        return next(createError(error.message, 400));   
    }
})