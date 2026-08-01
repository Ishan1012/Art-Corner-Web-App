import { Router } from 'express';
import feedbackController from '../controller/feedbackController';

const router = Router();

router.get('/', (req, res) => feedbackController.getAllFeedback(req, res));
router.post('/', (req, res) => feedbackController.createFeedback(req, res));
router.delete('/:id', (req, res) => feedbackController.deleteFeedback(req, res));

export default router;
export { router as feedbackRoutes };
