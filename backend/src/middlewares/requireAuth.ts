import {NextFunction, Request, Response} from 'express';

const jwt = require('jsonwebtoken');

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        let token = req.header('authorization');
        if (!token) {
            res.status(401).json(
                'Access denied. You must specify the user token'
            );
            return;
        }
        token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.params.decoded_user = JSON.stringify(decoded);
        next();
    } catch (e) {
        res.status(400).json('Invalid token');
    }
};
