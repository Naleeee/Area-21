import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database';

class OAuth extends Model {}

OAuth.init(
    {
        oauth_token_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'oauth_tokens',
        timestamps: false
    }
);

export default OAuth;
