import { Router } from 'express';
import commentController from '../controller/commentController';

const router = Router();

router.get('/post/:postId', (req, res) => commentController.getCommentsByPost(req, res));
router.post('/', (req, res) => commentController.createComment(req, res));
router.patch('/:id/vote', (req, res) => commentController.voteComment(req, res));
router.delete('/:id', (req, res) => commentController.deleteComment(req, res));

export default router;
export { router as commentRoutes };
