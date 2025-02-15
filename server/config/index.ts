import { generateDBURL, getNumericalValue } from "../utils";
import { DEFAULT_ACCESS_TOKEN_EXPIRE, DEFAULT_REFRESH_TOKEN_EXPIRE } from "./default.config";


let {
    PORT,
    ORIGIN,
    NODE_ENV,
    APP_NAME,
    DB_NAME,
    DB_PORT,
    DB_HOST,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY,
    REDIS_URL,
    TOKEN_ACTIVATION_SECRET,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,
    MAX_AGE_TO_EMPTY_COOKIE,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SERVICE,
    SMTP_MAIL,
    SMTP_PASSWORD
} = process.env as {
        PORT: string;
        ORIGIN: string;
        NODE_ENV: string;
        APP_NAME: string;
        DB_NAME: string;
        DB_PORT: string;
        DB_HOST: string;
        CLOUD_NAME: string;
        CLOUD_API_KEY: string
        CLOUD_SECRET_KEY: string;
        REDIS_URL: string;
        TOKEN_ACTIVATION_SECRET: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        ACCESS_TOKEN_EXPIRE: string;
        REFRESH_TOKEN_EXPIRE: string;
        MAX_AGE_TO_EMPTY_COOKIE: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_SERVICE: string;
        SMTP_MAIL: string;
        SMTP_PASSWORD: string;
};

const DB_URL = generateDBURL(DB_HOST, DB_PORT, DB_NAME);

export const CONFIG_PORTS = {
    PORT: getNumericalValue(PORT, 8000),
    DB_PORT: getNumericalValue(DB_PORT, 27017),
    SMTP_PORT: getNumericalValue(SMTP_PORT, 587),
    ACCESS_TOKEN_EXPIRE: getNumericalValue(ACCESS_TOKEN_EXPIRE, DEFAULT_ACCESS_TOKEN_EXPIRE),
    REFRESH_TOKEN_EXPIRE: getNumericalValue(REFRESH_TOKEN_EXPIRE, DEFAULT_REFRESH_TOKEN_EXPIRE),
};

export const NUMERIC_CONFIG = {
    MAX_AGE_TO_EMPTY_COOKIE: getNumericalValue(MAX_AGE_TO_EMPTY_COOKIE, 1)
}

export {
    ORIGIN, 
    NODE_ENV, 
    APP_NAME,
    DB_NAME, 
    DB_HOST,
    DB_URL,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY,
    REDIS_URL,
    TOKEN_ACTIVATION_SECRET,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    SMTP_HOST,
    SMTP_SERVICE,
    SMTP_MAIL,
    SMTP_PASSWORD
}