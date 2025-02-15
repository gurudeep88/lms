import { Model, model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { IUser } from "../interface/user.interface";
import { EMAIL_PATTERN } from "../constants/regExp";
import { SALT } from "../constants/db.constant";
import { ROLES } from "../constants/enum";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/port.config";
import { MINUTES_TO_MILLISECONDS } from "../constants/cookie.constant";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function(value: string){
                return EMAIL_PATTERN.test(value)
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password: {
        type: String,
       // required: [true, "Please enter your password"],
        minlength: [6, "Password must conatin at least 6 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: ROLES.User
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [{
        courseId: String
    }]
}, { timestamps: true });

// Hash Password before saving
userSchema.pre<IUser>(
    'save', async function (next) {
        if(!this.isModified('password')){
            next()
        }
        this.password = await bcrypt.hash(this.password, SALT);
        next();
    }
);

//sign access token
userSchema.methods.signAccessToken = function() {
    return signAccessToken({id: this._id});
}

//sign refresh token
userSchema.methods.signRefreshToken = function(){
    return signRefreshToken({id: this._id});
}

//compare password
userSchema.methods.comparePassword = async function (
    inputPassword: string
): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
};

const User: Model<IUser> = model('User', userSchema);

export default User;