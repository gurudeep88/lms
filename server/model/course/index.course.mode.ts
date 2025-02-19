import { Model, model, Schema } from "mongoose";
import { ICourse } from "../../interface/course.interface";
import { reviewSchema } from "./review.course.model";
import { courseDataSchema } from "./courseData.course.model";

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    tags: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    benefits: [ {title: String} ],
    prerequisites: [ {title: String} ],
    reviews: [ reviewSchema ],
    courseData: [ courseDataSchema ],
    ratings: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Course: Model<ICourse> = model('Course', courseSchema);

export default Course;
