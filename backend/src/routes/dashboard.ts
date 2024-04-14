import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import * as dashboardController from '../controllers/dashboardController';
import {requireAuth} from '../middlewares/requireAuth';

const router: express.Router = express.Router();

router.get('/', requireAuth, dashboardController.getAllAreas);
router.get('/:id', requireAuth, dashboardController.getAreaById);
router.get('/userid/:id', requireAuth, dashboardController.getAreaByUserId);
router.post(
    '/',
    [requireJsonContent, requireAuth],
    dashboardController.createArea
);
router.put(
    '/:id',
    [requireJsonContent, requireAuth],
    dashboardController.updateArea
);
router.delete('/:id', requireAuth, dashboardController.deleteArea);

export default router;
