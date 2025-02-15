export interface EnvConfig {
    PORT: string;
    ORIGIN: string;
    NODE_ENV: string;
    APP_NAME: string;
    DB_NAME: string;
    DB_PORT: string;
    DB_HOST: string;
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
}
