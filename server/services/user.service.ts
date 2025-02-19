import { Response } from "express";
import { httpResponse } from "../helper/api";
import { User } from "../model"
import { redis } from "../database/redis";
import { SUCCESS } from "../constants";
import { getSortedModelFields } from "./index.service";

export const getUserById = async(id: string, res: Response) => {
    const userJson = await redis.get(id);
    if(!userJson){
        return;
    }
    const user =  JSON.parse(userJson);
    return httpResponse(res, 200, user, SUCCESS);
}

export const listUsersService= async(res: Response) => {
    const users = await getSortedModelFields(User);
    return httpResponse(res, 200, users, SUCCESS);
}

export const updatetUserRoleService = async(res: Response, id: string, role: string) => {
    const user = await User.findByIdAndUpdate(id, {role}, {new: true});
    return httpResponse(res, 201, user, SUCCESS);
}

export const deleteUserService = async(res: Response, id: string) => {
    await User.deleteOne({_id: id});
    await redis.del(id);
    return httpResponse(res, 200, {success: true, message: "User deleted successfully"})
}