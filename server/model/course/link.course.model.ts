import { Schema } from "mongoose";
import { ILink } from "../../interface/course.interface";

export const linkSchema = new Schema<ILink>({
    title: String,
    url: String
})