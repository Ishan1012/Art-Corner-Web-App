import { Router } from 'express';
import newsletterController from '../controller/newsletterController';

const router = Router();

router.get('/', (req, res) => newsletterController.getAllNewsletters(req, res));
router.post('/', (req, res) => newsletterController.subscribeNewsletter(req, res));
router.delete('/:id', (req, res) => newsletterController.deleteNewsletter(req, res));

export default router;
export { router as newsletterRoutes };
