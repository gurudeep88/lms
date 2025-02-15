import express from "express"
import * as controller from "../controller/index";
import { isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.post('/register', controller.register);
router.post('/activate-user', controller.activateUser);
router.post('/login', controller.login);
router.get('/logout', isAuthenticated, controller.logout);
router.get('/refresh', controller.updateAccessToken);
router.get('/me', isAuthenticated, controller.getUserInfo);
router.post('/social-auth', controller.socialAuth);
router.put('/update-user-info', isAuthenticated, controller.updateUserInfo);
router.put('/update-user-password', isAuthenticated, controller.updatePassword);
router.put('/update-user-avatar', isAuthenticated, controller.updateAvatar);

export default router;