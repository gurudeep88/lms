import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { deleteUserService, listUsersService, updatetUserRoleService } from "../../services/user.service";
import { createError } from "../../helper/error";
import { User } from "../../model";
import { USER_NOT_FOUND } from "../../constants/http.constant";

export const listUsers = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        return await listUsersService(res);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const updateUserRole = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        return await updatetUserRoleService(res, id, role);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})

export const deleteUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            return next(createError(USER_NOT_FOUND, 404));
        }
        await deleteUserService(res, id);
    } catch (error: any) {
        return next(createError(error.message, 400));
    }
})