import { Schema } from "mongoose";
import { IQuestion } from "../../interface/course.interface";

export const questionSchema = new Schema<IQuestion>({
    user: Object,
    question: String,
    questionReplies: [ Object ]
})