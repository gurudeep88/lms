import { v2 } from "cloudinary";

export const uploadToCloudinary = async(data: any, folder: string, width?: number) => {
    const cloud = await v2.uploader.upload(
        data,
        {
            folder,
            width
        }
    );
    return {
        public_id: cloud.public_id,
        url: cloud.secure_url
    }
}

export const deleteFromCloudinary = async(id: string) => {
    await v2.uploader.destroy(id);
}