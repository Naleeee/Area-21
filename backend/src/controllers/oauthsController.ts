import {Request, Response} from 'express';
import OAuth from '../models/OAuth.model';
import * as asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import Service from '../models/service.model';
import axios from 'axios';

export const getAllOauth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const oauth: OAuth[] = await OAuth.findAll();
        res.status(200).json(oauth);
    }
);

export const getOauthById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                oauth_token_id: req.params.id
            }
        });

        if (!oauth) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(oauth);
    }
);

export const getOauthByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const oauth: OAuth[] = await OAuth.findAll({
            where: {
                user_id: req.params.id
            }
        });

        if (!oauth) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(oauth);
    }
);

export const createOauth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.user_id ||
            !req.body.service_id ||
            !req.body.token ||
            !req.body.refresh_token
        ) {
            res.status(400).json({message: 'Name parameter is missing.'});
            return;
        }

        const oauth: OAuth = await OAuth.create({
            user_id: req.body.user_id,
            service_id: req.body.service_id,
            token: req.body.token,
            refresh_token: req.body.refresh_token
        });
        res.status(201).json(oauth);
    }
);

export const updateOauth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.user_id ||
            !req.body.service_id ||
            !req.body.token ||
            req.params.id
        ) {
            res.status(400).json({message: 'ID or name parameter is missing.'});
            return;
        }

        const result: [affectedCount: number] = await OAuth.update(
            {
                user_id: req.body.user_id,
                service_id: req.body.service_id,
                token: req.body.token,
                refresh_token: req.body.refresh_token
            },
            {
                where: {
                    oauth_token_id: req.params.id
                }
            }
        );

        if (result[0] === 0) {
            res.status(404).json({
                message: `Could not find service with id ${req.body.id}.`
            });
            return;
        }
        res.status(200).json({
            user_id: req.body.user_id,
            service_id: req.body.service_id,
            token: req.body.token,
            refresh_token: req.body.refresh_token
        });
    }
);

export const deleteOauth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const result: number | null = await OAuth.destroy({
            where: {
                oauth_token_id: req.params.id
            }
        });

        if (!result) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(204).send();
    }
);

const handleOAuth = async (
    res: Response,
    req: Request,
    userId: number,
    createdUser: boolean,
    service: Service,
    oauth: OAuth | null
): Promise<void> => {
    if (createdUser || !oauth) {
        await OAuth.create({
            user_id: userId,
            service_id: service.get().service_id,
            token: req.body.token,
            refresh_token: req.body.refresh_token
        });
        res.status(201).json({
            user_id: userId,
            token: User.generateAccessToken(userId, req.body.email)
        });
        return;
    }
    await OAuth.update(
        {
            user_id: userId,
            service_id: service.get().service_id,
            token: req.body.token,
            refresh_token: req.body.refresh_token
        },
        {
            where: {
                user_id: userId,
                service_id: service.get().service_id
            }
        }
    );
    res.status(200).json({
        user_id: userId,
        token: User.generateAccessToken(userId, req.body.email)
    });
};

export const googleConnection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.email ||
            !req.body.token ||
            !req.body.refresh_token
        ) {
            res.status(400).json({
                message: 'We need parameters email and token'
            });
            return;
        }

        const [user, createdUser] = await User.findOrCreate({
            where: {
                email: req.body.email
            }
        });

        const [service] = await Service.findOrCreate({
            where: {
                name: 'google'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user.get().user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(
                res,
                req,
                user.get().user_id,
                createdUser,
                service,
                oauth
            );
        } catch (e) {
            console.log(e);
            return;
        }
    }
);

export const googleAlreadyConnected = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.token || !req.body.refresh_token) {
            res.status(400).json({
                message: 'We need parameters token and refresh token'
            });
            return;
        }

        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const [service] = await Service.findOrCreate({
            where: {
                name: 'google'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(res, req, user_id, false, service, oauth);
        } catch (e) {
            console.log(e);
            return;
        }
    }
);

export const spotifyConnection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.token || !req.body.refresh_token) {
            res.status(400).json({
                message: 'We need parameters email and token'
            });
            return;
        }

        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const [service] = await Service.findOrCreate({
            where: {
                name: 'spotify'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(res, req, user_id, false, service, oauth);
        } catch (e) {
            console.log(e);
            return;
        }
    }
);

export const spotifyLogout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const service: Service | null = await Service.findOne({
            where: {
                name: 'spotify'
            }
        });

        if (!service) {
            res.status(400).json({
                message: 'Spotify is not connected'
            });
            return;
        }
        const result: number | null = await OAuth.destroy({
            where: {
                user_id: user_id,
                service_id: service?.get().service_id
            }
        });

        if (!result) {
            res.status(400).json({
                message: 'Spotify is not connected'
            });
            return;
        }
        res.status(204).send();
        return;
    }
);

export const facebookConnection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.token || !req.body.refresh_token) {
            res.status(400).json({
                message: 'We need parameters email and token'
            });
            return;
        }

        const user_id = JSON.parse(req.params.decoded_user).user_id;

        let longLifeToken;
        try {
            longLifeToken = await axios.get(
                `https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.API_FACEBOOK_ID}&client_secret=${process.env.API_FACEBOOK_SECRET}&fb_exchange_token=${req.body.token}`
            );
        } catch (e) {
            console.log(
                'Error when trying to convert token to long life token'
            );
        }

        if (longLifeToken && longLifeToken.data.access_token)
            req.body.token = longLifeToken.data.access_token;

        const [service] = await Service.findOrCreate({
            where: {
                name: 'facebook'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(res, req, user_id, false, service, oauth);
        } catch (e) {
            console.log(e);
            return;
        }
    }
);

export const facebookLogout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const service: Service | null = await Service.findOne({
            where: {
                name: 'facebook'
            }
        });

        if (!service) {
            res.status(400).json({
                message: 'Facebook is not connected'
            });
            return;
        }
        const result: number | null = await OAuth.destroy({
            where: {
                user_id: user_id,
                service_id: service?.get().service_id
            }
        });

        if (!result) {
            res.status(400).json({
                message: 'Facebook is not connected'
            });
            return;
        }
        res.status(204).send();
        return;
    }
);

export const githubConnection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.token || !req.body.refresh_token) {
            res.status(400).json({message: 'We need parameters token'});
            return;
        }
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const [service] = await Service.findOrCreate({
            where: {
                name: 'github'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(res, req, user_id, false, service, oauth);
        } catch (e) {
            console.log(e);
            return;
        }
    }
);
export const githubLogout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const service: Service | null = await Service.findOne({
            where: {
                name: 'github'
            }
        });

        if (!service) {
            res.status(400).json({
                message: 'Github is not connected'
            });
            return;
        }
        const result: number | null = await OAuth.destroy({
            where: {
                user_id: user_id,
                service_id: service?.get().service_id
            }
        });

        if (!result) {
            res.status(400).json({
                message: 'Github is not connected'
            });
            return;
        }
        res.status(204).send();
        return;
    }
);
export const todoistConnection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.token || !req.body.refresh_token) {
            res.status(400).json({message: 'We need parameters token'});
            return;
        }
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const [service] = await Service.findOrCreate({
            where: {
                name: 'todoist'
            }
        });

        const oauth: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service.get().service_id
            }
        });

        try {
            await handleOAuth(res, req, user_id, false, service, oauth);
        } catch (e) {
            console.log(e);
            return;
        }
    }
);
export const todoistLogout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        const service: Service | null = await Service.findOne({
            where: {
                name: 'todoist'
            }
        });

        if (!service) {
            res.status(400).json({
                message: 'Todoist is not connected'
            });
            return;
        }
        const result: number | null = await OAuth.destroy({
            where: {
                user_id: user_id,
                service_id: service?.get().service_id
            }
        });

        if (!result) {
            res.status(400).json({
                message: 'Todoist is not connected'
            });
            return;
        }
        res.status(204).send();
        return;
    }
);

export const isConnected = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user_id = JSON.parse(req.params.decoded_user).user_id;

        if (!req.body || !req.body.name) {
            res.status(400).json({
                message: 'Error we need the service name'
            });
            return;
        }

        const service: Service | null = await Service.findOne({
            where: {
                name: req.body.name
            }
        });

        if (!service) {
            res.status(400).json({
                message: 'Service name unknown'
            });
            return;
        }
        const result: OAuth | null = await OAuth.findOne({
            where: {
                user_id: user_id,
                service_id: service?.get().service_id
            }
        });

        if (!result) {
            res.status(200).json({
                message: 'Not connected'
            });
            return;
        }
        res.status(200).json({
            message: 'Is connected'
        });
        return;
    }
);
