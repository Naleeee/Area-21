import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database';

class Reaction extends Model {}

Reaction.init(
    {
        reaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        token_required: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        arguments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        tableName: 'reactions',
        timestamps: false
    }
);

export default Reaction;
