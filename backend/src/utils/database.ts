import {Sequelize} from 'sequelize';
import config from '../config/db.config';

const sequelizeConnection = new Sequelize(
    config.name,
    config.user,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: false
    }
);

export default sequelizeConnection;
