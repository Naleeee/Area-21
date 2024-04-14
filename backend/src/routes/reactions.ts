import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import * as reactionController from '../controllers/reactionsController';
import {requireAuth} from '../middlewares/requireAuth';
const router: express.Router = express.Router();

router.get('/', requireAuth, reactionController.getAllReactions);
router.get('/:id', requireAuth, reactionController.getReactionById);
router.get(
    '/serviceid/:id',
    requireAuth,
    reactionController.getReactionByServiceId
);
router.post(
    '/',
    [requireJsonContent, requireAuth],
    reactionController.createReaction
);
router.put(
    '/:id',
    [requireJsonContent, requireAuth],
    reactionController.updateReaction
);
router.delete('/:id', requireAuth, reactionController.deleteReaction);

export default router;
