import * as asyncHandler from 'express-async-handler';
import {NextFunction, Request, Response} from 'express';
import User from '../models/user.model';

export const checkDuplicateEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!req || !req.body.email)
            res.status(400).json({message: 'Email parameter is missing.'});

        const user: User | null = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            res.status(400).json({message: 'User already exists.'});
            return;
        }
        next();
    }
);
