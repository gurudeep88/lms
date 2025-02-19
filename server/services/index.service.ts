import { Model } from "mongoose";

export const getSortedModelFields = async(model: Model<any>) => {
    return await model.find()?.sort({createdAt: -1});
}