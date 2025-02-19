import express from 'express';
import { course, adminCourse } from '../controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { ROLES } from '../constants/user.constant';
const router = express();

router.post('/admin/course', isAuthenticated, authorizeRoles(ROLES.Admin), course.uploadCourse);
router.put('/admin/course/:id', isAuthenticated, authorizeRoles(ROLES.Admin), course.editCourse);
router.get('/course/:id', course.getCourse);
router.get('/course', course.listCourses);
router.get('/course/content/:id' , isAuthenticated, course.getCourseContentByUser);
router.put('/course/reply/question' , isAuthenticated, course.addQuestion);
router.put('/course/question/' , isAuthenticated, course.addReply);
router.put('/course/review/:id' , isAuthenticated, course.addReview);
router.put('/admin/course/reply/review' , isAuthenticated, authorizeRoles(ROLES.Admin), course.addReviewReply);

// admin routes
router.get('/admin/course', isAuthenticated, authorizeRoles(ROLES.Admin), adminCourse.listCourses);
router.delete('/admin/course/:id', isAuthenticated, authorizeRoles(ROLES.Admin), adminCourse.deleteCourse);

export default router;