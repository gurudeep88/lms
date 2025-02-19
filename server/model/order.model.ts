import { Model, model, Schema } from "mongoose";
import { IOrder } from "../interface/order.interface";

const orderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    paymentInfo: {
        type: Object,
       // required: true
    }
}, { timestamps: true });

const Order: Model<IOrder> = model('Order', orderSchema);
export default Order;