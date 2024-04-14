import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import * as oauthsController from '../controllers/oauthsController';
import {requireAuth} from '../middlewares/requireAuth';
const router: express.Router = express.Router();

router.get('/', requireAuth, oauthsController.getAllOauth);
router.get('/:id', requireAuth, oauthsController.getOauthById);
router.get('/userid/:id', requireAuth, oauthsController.getOauthByUserId);
router.post(
    '/',
    [requireJsonContent, requireAuth],
    oauthsController.createOauth
);
router.put(
    '/:id',
    [requireJsonContent, requireAuth],
    oauthsController.updateOauth
);
router.delete('/:id', requireAuth, oauthsController.deleteOauth);

router.post('/google', requireJsonContent, oauthsController.googleConnection);

router.post(
    '/google/alreadyLoggedIn',
    [requireJsonContent, requireAuth],
    oauthsController.googleAlreadyConnected
);

router.post(
    '/spotify',
    [requireJsonContent, requireAuth],
    oauthsController.spotifyConnection
);
router.get('/spotify/logout', requireAuth, oauthsController.spotifyLogout);

router.post(
    '/facebook',
    [requireJsonContent, requireAuth],
    oauthsController.facebookConnection
);
router.get('/facebook/logout', requireAuth, oauthsController.facebookLogout);

router.post(
    '/github',
    [requireJsonContent, requireAuth],
    oauthsController.githubConnection
);
router.get('/github/logout', requireAuth, oauthsController.githubLogout);

router.post(
    '/todoist',
    [requireJsonContent, requireAuth],
    oauthsController.todoistConnection
);
router.get('/todoist/logout', requireAuth, oauthsController.todoistLogout);

router.post(
    '/isConnected',
    [requireJsonContent, requireAuth],
    oauthsController.isConnected
);
export default router;
