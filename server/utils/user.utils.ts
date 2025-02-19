import { TOKEN_ACTIVATION_SECRET } from "../config";
import { IActivationToken, IRegistrationBody, IUser } from "../interface/user.interface";
import jwt from 'jsonwebtoken';
import { signJwtToken } from "./jwt";
import { ACTIVATION_TOKEN_EXPIRE } from "../config/port.config";
import { MINUTE_TO_MILLISECONDS } from "../constants";

export const createActivationCode = () => {
    return Math.floor(1000 + Math.random() * 9000 ).toString();
}

export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = createActivationCode();
    const token = signJwtToken(
        { user, activationCode }, 
        TOKEN_ACTIVATION_SECRET, 
        { expiresIn: ACTIVATION_TOKEN_EXPIRE * MINUTE_TO_MILLISECONDS}
    )
    return { token, activationCode };
}
