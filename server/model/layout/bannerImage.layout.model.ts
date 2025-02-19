import { Schema } from "mongoose";
import { IBannerImage } from "../../interface/layout.interface";

export const bannerImageSchema = new Schema<IBannerImage>({
    public_id: {
        type: String
    },
    url: {
        type: String
    }
});