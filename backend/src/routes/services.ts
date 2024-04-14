import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import * as serviceController from '../controllers/servicesController';
import {requireAuth} from '../middlewares/requireAuth';

const router: express.Router = express.Router();

router.get('/', requireAuth, serviceController.getAllServices);
router.get('/:id', requireAuth, serviceController.getServiceById);
router.post(
    '/',
    [requireJsonContent, requireAuth],
    serviceController.createService
);
router.put(
    '/:id',
    [requireJsonContent, requireAuth],
    serviceController.updateService
);
router.delete('/:id', requireAuth, serviceController.deleteService);

export default router;
