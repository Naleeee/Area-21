import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import {requireAuth} from '../middlewares/requireAuth';
import * as actionController from '../controllers/actionsController';
const router: express.Router = express.Router();

router.get('/', requireAuth, actionController.getAllActions);
router.get('/:id', requireAuth, actionController.getActionById);
router.get(
    '/serviceid/:id',
    requireAuth,
    actionController.getActionByServiceId
);
router.post(
    '/',
    [requireJsonContent, requireAuth],
    actionController.createAction
);
router.put(
    '/:id',
    [requireJsonContent, requireAuth],
    actionController.updateAction
);
router.delete('/:id', requireAuth, actionController.deleteAction);

export default router;
