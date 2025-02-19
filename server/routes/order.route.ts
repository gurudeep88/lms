import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { adminOrder, order } from '../controller';
import { ROLES } from '../constants/user.constant';
const router = express.Router();

router.post('/order', isAuthenticated, order.createOrder);

//admin routes
router.get('/admin/order', isAuthenticated, authorizeRoles(ROLES.Admin), adminOrder.listOrders);

export default router;