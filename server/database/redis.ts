import Redis from "ioredis";
import { REDIS_URL } from "../config"
import { createError } from "../helper/error";

const getClient = () => {
    if(REDIS_URL){
        console.log(' Redis database connected successfully ');
        return REDIS_URL;
    }
    throw createError('Redis connection failed!');
}

export const redis = new Redis(getClient());