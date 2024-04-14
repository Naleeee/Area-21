import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY: jwt.Secret = process.env.SECRET_KEY || '';

class User extends Model {
    static generateHash = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, bcrypt.genSaltSync(10));
    };

    static validPassword = async (
        password: string,
        hash: string
    ): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    };

    static generateAccessToken = (user_id: number, email: string): string => {
        return jwt.sign({user_id: user_id, email: email}, SECRET_KEY, {
            expiresIn: '1d'
        });
    };
}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false
    }
);

export default User;
