import { Response } from "express"

export const httpResponse = (res: Response, code: number, payload: any) => {
    return res.status(code).json(payload)
}
