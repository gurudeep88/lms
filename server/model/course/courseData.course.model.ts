import { Schema } from "mongoose";
import { ICourseData } from "../../interface/course.interface";
import { linkSchema } from "./link.course.model";
import { questionSchema } from "./question.course.model";

export const courseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoUrl: String,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [ linkSchema ],
    suggestion: String,
    questions: [ questionSchema ]
})
