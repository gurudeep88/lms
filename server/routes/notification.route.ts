import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { ROLES } from '../constants/user.constant';
import { adminNotification } from '../controller';
const router = express.Router();

router.get('/admin/notification', isAuthenticated, authorizeRoles(ROLES.Admin), adminNotification.getNotifications);
router.put('/admin/notification/:id', isAuthenticated, authorizeRoles(ROLES.Admin), 
adminNotification.updateNotification );

export default router;