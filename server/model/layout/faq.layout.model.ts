import { Schema } from "mongoose";
import { IFaqItem } from "../../interface/layout.interface";

export const faqSchema = new Schema<IFaqItem>({
    question: {
        type: String
    },
    answer: {
        type: String
    }
});
