import * as express from 'express';
import sequelize from './utils/database';
import userRouter from './routes/users';
import dashboardRoutes from './routes/dashboard';
import servicesRouter from './routes/services';
import about from './routes/about';
import actionRouter from './routes/actions';
import reactionRouter from './routes/reactions';
import oauthRouter from './routes/oauths';
import * as cors from 'cors';
import clock from './services/clock';
import {setupDb} from './utils/defaultValue';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
const app: express.Express = express();
// @ts-ignore
import * as expressip from 'express-ip';

const port = process.env.APP_PORT || 3333;

app.use(expressip().getIpInfoMiddleware);
app.use(
    cors({
        origin: '*'
    })
);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', about);
app.use('/users', userRouter);
app.use('/dashboard', dashboardRoutes);
app.use('/services', servicesRouter);
app.use('/actions', actionRouter);
app.use('/reactions', reactionRouter);
app.use('/oauth', oauthRouter);

app.use('/clock', clock);

try {
    sequelize
        .authenticate()
        .then(() =>
            console.log(
                'Connection to the database has been established successfully.'
            )
        );
} catch (error) {
    console.error('Unable to connect to the database: ', error);
}

sequelize
    .sync()
    .then(() => {
        (async () => {
            await setupDb();
            console.log('basic data insert successfully');
        })().catch(e => {
            console.log('basic data not insert', e);
        });
        app.listen(port, () =>
            console.log(`Application listening on http://localhost:${port}`)
        );
    })
    .catch(error => {
        console.log(`An error occurred: ${error}`);
    });
