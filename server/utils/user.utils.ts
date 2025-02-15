import { TOKEN_ACTIVATION_SECRET } from "../config";
import { ACTIVATION_TOKEN_EXPIRES_IN } from "../constants";
import { IActivationToken, IRegistrationBody, IUser } from "../interface/user.interface";
import jwt from 'jsonwebtoken';
import { signJwtToken } from "./jwt";

export const createActivationCode = () => {
    return Math.floor(1000 + Math.random() * 9000 ).toString();
}

export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = createActivationCode();
    const token = signJwtToken(
        { user, activationCode }, 
        TOKEN_ACTIVATION_SECRET, 
        { expiresIn: ACTIVATION_TOKEN_EXPIRES_IN }
    )
    return { token, activationCode };
}
