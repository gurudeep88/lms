import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/CatchAsyncError";
import { createError } from "../../helper/error";
import { LAYOUT_TYPE } from "../../constants/layout.constant";
import { Layout } from "../../model";
import { deleteFromCloudinary, uploadToCloudinary } from "../../services/cloudinary.service";
import { CLOUDINARY_FOLDER } from "../../constants/cloudinary.constant";
import { httpResponse } from "../../helper/api";
import { SUCCESS } from "../../constants";

export const createLayout = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
 try {
    const { type } = req.body;
    const isTypeExisted = await Layout.findOne({type});
    if(isTypeExisted){
        return next(createError( `Type ${type} already exists`, 409 ))
    }
    if(type === LAYOUT_TYPE.Banner){
        const { image, title, subTitle } = req.body;
        const { public_id, url } = await uploadToCloudinary(image, CLOUDINARY_FOLDER.Layout);
        const banner = { 
            image: {
                public_id,
                url
            }, 
            title, 
            subTitle 
        };
        await Layout.create({ type, banner});
    }
    if(type === LAYOUT_TYPE.FAQ){
        const { faq} = req.body;
        await Layout.create({ type, faq });
    }
    if(type === LAYOUT_TYPE.Categories){
        const { categories } = req.body;
        await Layout.create({ type, categories });
    }
    return httpResponse(res, 201, {success: true, message: "Layout created successfully"});
 } catch (error: any) {
    return next(createError(error.message, 500));
 }   
}) 

export const editLayout = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
       const { type } = req.body;
       if(type === LAYOUT_TYPE.Banner){
           const bannerData: any = await Layout.findOne({ type });
           const { image, title, subTitle } = req.body;
           if(bannerData){
            await deleteFromCloudinary(bannerData.image.public_id);
           }
           const { public_id, url } = await uploadToCloudinary(image, CLOUDINARY_FOLDER.Layout);
           const banner = { 
               image: {
                   public_id,
                   url
               }, 
               title, 
               subTitle 
           };
           await Layout.findByIdAndUpdate(bannerData._id, { type, banner});
       }
       if(type === LAYOUT_TYPE.FAQ){
           const { faq} = req.body;
           const faqData = await Layout.findOne({ type });
           await Layout.findByIdAndUpdate(faqData?._id, { type, faq });
       }
       if(type === LAYOUT_TYPE.Categories){
           const { categories } = req.body;
           const categoryData = await Layout.findOne({ type });
           await Layout.findByIdAndUpdate(categoryData?._id, { type, categories });
       }
       return httpResponse(res, 200, {success: true, message: "Layout updated successfully"});
    } catch (error: any) {
       return next(createError(error.message, 500));
    }   
}) 

export const getLayout = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
       const layout = await Layout.findOne({type});
       return httpResponse(res, 200, layout, SUCCESS);
    } catch (error: any) {
       return next(createError(error.message, 500));
    }   
}) 