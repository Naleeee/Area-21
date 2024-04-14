import * as express from 'express';
import {requireJsonContent} from '../middlewares/requireJsonContent';
import {checkDuplicateEmail} from '../middlewares/verifyRegister';
import {requireAuth} from '../middlewares/requireAuth';
import * as userController from '../controllers/usersController';

const router: express.Router = express.Router();

router.post(
    '/register',
    [requireJsonContent, checkDuplicateEmail],
    userController.createUser
);
router.post('/login', requireJsonContent, userController.loginUser);
router.put(
    '/updatepassword',
    [requireAuth, requireJsonContent],
    userController.updatePassword
);

export default router;
