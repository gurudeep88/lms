import { Response } from "express";
import { httpResponse } from "../helper/api";
import { User } from "../model"
import { redis } from "../database/redis";

export const getUserById = async(id: string, res: Response) => {
    const userJson = await redis.get(id);
    if(!userJson){
        return;
    }
    const user =  JSON.parse(userJson);
    return httpResponse(res, 200, {
        success: true, 
        user
    });
}