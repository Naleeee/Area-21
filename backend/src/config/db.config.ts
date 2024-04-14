import {Dialect} from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();
const db = {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWD as string,
    name: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT) as number,
    dialect: 'mysql' as Dialect
};

export default db;
