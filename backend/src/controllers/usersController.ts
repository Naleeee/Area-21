import {Request, Response} from 'express';
import User from '../models/user.model';
import * as asyncHandler from 'express-async-handler';

export const createUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.email) {
            res.status(400).json({message: 'Email parameter is missing.'});
            return;
        }

        const newUser: User = await User.create({
            email: req.body.email,
            password: req.body.password
                ? await User.generateHash(req.body.password)
                : null
        });
        const token: string = User.generateAccessToken(
            newUser.get().user_id,
            req.body.email
        );

        res.status(201).json({
            user_id: newUser.get().user_id,
            email: newUser.get().email,
            token: token
        });
    }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.email || !req.body.password) {
            res.status(400).json({message: 'Invalid credentials.'});
            return;
        }

        const user: User | null = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            res.status(401).json({message: 'Invalid credentials.'});
            return;
        }
        if (
            !(await User.validPassword(req.body.password, user.get().password))
        ) {
            res.status(401).json({message: 'Incorrect password.'});
            return;
        }

        const token = User.generateAccessToken(
            user.get().user_id,
            req.body.email
        );
        res.status(200).json({
            user_id: user.get().user_id,
            token: token
        });
    }
);

export const updatePassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req || !req.body || !req.body.password) {
            res.status(400).json({
                message: 'Invalid argument: we need new password'
            });
            return;
        }
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const user: User | null = await User.findOne({
            where: {
                user_id: user_id
            }
        });
        if (user?.get().password == null) {
            res.status(400).json({
                message:
                    "You can't change the password for user who register with OAuth"
            });
            return;
        }
        await User.update(
            {
                password: req.body.password
                    ? await User.generateHash(req.body.password)
                    : null
            },
            {
                where: {
                    user_id: user_id
                }
            }
        );
        res.status(204).send();
    }
);
