import { EMAIL_PATTERN } from "../constants/regExp"

export const validateEmail = function(value: string){
    return EMAIL_PATTERN.test(value)
}