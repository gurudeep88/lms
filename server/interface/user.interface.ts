import { Document } from "mongoose";
import { SameSite } from "../type/user.type";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: IUpdateProfilePictureBody,
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken:() => string;
    signRefreshToken:() => string;
}

export interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface IActivationToken {
    token: string;
    activationCode: string;
}

export interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: SameSite;
    secure?: boolean;
}

export interface ISocialAuthBody {
    email: string; 
    name: string; 
    avatar: string;
}

export interface IUpdateUserInfoBody {
    email: string; 
    name: string;
}

export interface IUpdatePasswordBody {
    oldPassword: string; 
    newPassword: string;
}

export interface IUpdateProfilePictureBody {
    public_id: string;
    url: string;
}

export interface IUpdateProfilePicture {
    avatar: string
}
