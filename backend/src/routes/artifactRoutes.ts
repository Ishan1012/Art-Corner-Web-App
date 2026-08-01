import { Router } from 'express';
import artifactController from '../controller/artifactController';

const router = Router();

router.get('/', (req, res) => artifactController.getAllArtifacts(req, res));
router.post('/upload', (req, res) => artifactController.uploadArtifact(req, res));
router.get('/search/:query', (req, res) => artifactController.searchArtifacts(req, res));
router.get('/:id', (req, res) => artifactController.getArtifactById(req, res));
router.delete('/:id', (req, res) => artifactController.deleteArtifact(req, res));
router.patch('/:id/like', (req, res) => artifactController.likeArtifact(req, res));
router.patch('/:id/unlike', (req, res) => artifactController.unlikeArtifact(req, res));

export default router;
export { router as artifactRoutes };
