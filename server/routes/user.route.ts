import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { user, adminUser } from "../controller";
import { ROLES } from "../constants/user.constant";
const router = express.Router();

router.post('/register', user.register);
router.post('/activate-user', user.activateUser);
router.post('/login', user.login);
router.get('/logout', isAuthenticated, user.logout);
router.get('/refresh', user.updateAccessToken);
router.get('/me', isAuthenticated, user.getUserInfo);
router.post('/social-auth', user.socialAuth);
router.put('/update-user-info', isAuthenticated, user.updateUserInfo);
router.put('/update-user-password', isAuthenticated, user.updatePassword);
router.put('/update-user-avatar', isAuthenticated, user.updateAvatar);

// admin routes
router.get('/admin/user', isAuthenticated, authorizeRoles(ROLES.Admin), adminUser.listUsers);
router.put('/admin/user', isAuthenticated, authorizeRoles(ROLES.Admin), adminUser.updateUserRole);
router.delete('/admin/user/:id', isAuthenticated, authorizeRoles(ROLES.Admin), adminUser.deleteUser);

export default router;