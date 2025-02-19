import { model, Model, Schema } from "mongoose";
import { INotification } from "../interface/notification.interface";
import { NOTIFICATION_DEFAULT_STATUS } from "../constants/notification.constant";

const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: NOTIFICATION_DEFAULT_STATUS.Unread
    }
}, { timestamps: true });

const Notification: Model<INotification> = model('Notification', notificationSchema);

export default Notification;