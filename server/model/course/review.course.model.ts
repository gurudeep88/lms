import { Schema } from "mongoose";
import { IReview } from "../../interface/course.interface";

export const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies: [ Object ]
});