import { Router } from 'express';
import userController from '../controller/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', (req, res) => userController.signup(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/google-login', (req, res) => userController.googleLogin(req, res));
router.get('/verify', (req, res) => userController.verifyEmail(req, res));
router.get('/getlist/:pass', (req, res) => userController.getUserList(req, res));
router.put('/:id', authMiddleware, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authMiddleware, (req, res) => userController.deleteUser(req, res));

export default router;
export { router as userRoutes };
