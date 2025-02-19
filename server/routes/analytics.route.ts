import express from 'express';
import { adminAnalytics } from '../controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { ROLES } from '../constants/user.constant';
const router = express.Router();

router.get('/admin/analytics/user', isAuthenticated, authorizeRoles(ROLES.Admin), adminAnalytics.getUsersAnalytics);
router.get('/admin/analytics/course', isAuthenticated, authorizeRoles(ROLES.Admin), 
adminAnalytics.getCoursesAnalytics);
router.get('/admin/analytics/order', isAuthenticated, authorizeRoles(ROLES.Admin), adminAnalytics.getOrdersAnalytics);

export default router;