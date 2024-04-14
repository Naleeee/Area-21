import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database';

class Area extends Model {}

Area.init(
    {
        area_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: true,
            defaultValue: 'New AREA'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action_arguments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null
        },
        reaction_arguments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null
        },
        action_data: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        tableName: 'areas',
        timestamps: false
    }
);

export default Area;
