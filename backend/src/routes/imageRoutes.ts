import { Router } from 'express';
import imageController from '../controller/imageController';

const router = Router();

router.post('/generate', (req, res) => imageController.generateImage(req, res));
router.get('/', (req, res) => imageController.getAllImages(req, res));
router.get('/:id', (req, res) => imageController.getImageById(req, res));
router.delete('/:id', (req, res) => imageController.deleteImage(req, res));

export default router;
export { router as imageRoutes };
