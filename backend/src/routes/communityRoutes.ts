import { Router } from 'express';
import communityController from '../controller/communityController';

const router = Router();

router.get('/', (req, res) => communityController.getAllCommunities(req, res));
router.post('/create', (req, res) => communityController.createCommunity(req, res));
router.get('/:id', (req, res) => communityController.getCommunityById(req, res));
router.patch('/:id/join', (req, res) => communityController.joinCommunity(req, res));
router.patch('/:id/leave', (req, res) => communityController.leaveCommunity(req, res));
router.delete('/:id', (req, res) => communityController.deleteCommunity(req, res));

export default router;
export { router as communityRoutes };
