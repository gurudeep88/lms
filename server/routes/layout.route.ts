import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { ROLES } from '../constants/user.constant';
import { adminLayout } from '../controller';
const router = express.Router();

router.post('/admin/layout', isAuthenticated, authorizeRoles(ROLES.Admin), adminLayout.createLayout);
router.put('/admin/layout', isAuthenticated, authorizeRoles(ROLES.Admin), adminLayout.editLayout);
router.get('/admin/layout', isAuthenticated, authorizeRoles(ROLES.Admin), adminLayout.getLayout);

export default router;