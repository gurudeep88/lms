import { Response } from "express"

export const setCookie = (res: Response, key: string, value: any, options: any) => {
    res.cookie(`${key}`, value, options)
}