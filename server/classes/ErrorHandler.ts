export class ErrorHandler extends Error {
    statusCode?: number;
    errorName?: string;
    constructor(message: string, statusCode?: number, errorName?: string){
        super(message);
        this.statusCode = statusCode;
        this.errorName = errorName;
        
        Error.captureStackTrace(this, this.constructor);
    }
}