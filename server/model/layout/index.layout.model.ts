import { model, Schema } from "mongoose";
import { faqSchema } from "./faq.layout.model";
import { categorySchema } from "./category.layout.model";
import { ILayout } from "../../interface/layout.interface";
import { bannerImageSchema } from "./bannerImage.layout.model";

const schema = new Schema<ILayout>({
    type: {
        type: String
    },
    faq: [ faqSchema ],
    categories: [ categorySchema ],
    banner: {
        image: bannerImageSchema,
        title:{
            type: String
        },
        subTitle: {
            type: String
        }
    }
}, { timestamps: true });

const Layout = model<ILayout>('Layout', schema);

export default Layout;