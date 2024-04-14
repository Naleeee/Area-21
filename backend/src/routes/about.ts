import * as aboutController from '../controllers/aboutController';
import * as express from 'express';

const router: express.Router = express.Router();

router.get('/about.json', aboutController.getAbout);

export default router;
