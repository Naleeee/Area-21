import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database';

class Service extends Model {}

Service.init(
    {
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'services',
        timestamps: false
    }
);

export default Service;
