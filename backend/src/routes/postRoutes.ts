import { Router } from 'express';
import postController from '../controller/postController';

const router = Router();

router.get('/community/:communityId', (req, res) => postController.getPostsByCommunity(req, res));
router.get('/:id', (req, res) => postController.getPostById(req, res));
router.post('/', (req, res) => postController.createPost(req, res));
router.patch('/:id/vote', (req, res) => postController.votePost(req, res));
router.delete('/:id', (req, res) => postController.deletePost(req, res));

export default router;
export { router as postRoutes };
