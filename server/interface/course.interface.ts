import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IComment extends Document {
    user: IUser;
    comment: string;
    commentReplies?: IComment[];
}

export interface IQuestion extends Document {
    user: IUser;
    question: string;
    questionReplies?: IQuestion[];
}

export interface IReview extends Document{
    user: IUser;
    rating: number;
    comment: string;
    commentReplies?: IComment[];
}

export interface ILink extends Document {
    title: string;
    url: string;
}

export interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IQuestion[];
}

export interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    demoUrl: string;
    level: string;
    benefits: {title: string}[];
    prerequisites: {title: string}[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}

export interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export interface IAddReplyData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export interface IAddReviewData {
    review: string;
    rating: number;
}

export interface IAddReviewReplyData {
    comment: string;
    courseId: string;
    reviewId: string;
}