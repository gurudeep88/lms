import { ErrorHandler } from "../classes/ErrorHandler";

export const createError = (message: string, statusCode?: number, errorName?: string): Error => {
        return new ErrorHandler(message, statusCode, errorName);
}