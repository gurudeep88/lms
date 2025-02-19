import { Schema } from "mongoose";
import { IComment } from "../../interface/course.interface";

export const commentSchema = new Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [ Object ]
})