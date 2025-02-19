import { Schema } from "mongoose";
import { ICategory } from "../../interface/layout.interface";

export const categorySchema = new Schema<ICategory>({
    title: {
        type: String
    }
});