import {NextFunction, Request, Response} from 'express';

export const requireJsonContent = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).json({message: 'Server requires application/json'});
        return;
    }
    next();
};
