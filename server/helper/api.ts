import { Response } from "express"

export const httpResponse = (res: Response, code: number, payload?: any, success?: boolean) => {
    if(success){
        return res.status(code).json({
            success,
            payload
        })
    }else {
        return res.status(code).json(payload)
    }
}
