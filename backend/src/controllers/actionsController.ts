import {Request, Response} from 'express';
import Action from '../models/action.model';
import * as asyncHandler from 'express-async-handler';

export const getAllActions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const actions: Action[] = await Action.findAll();
        res.status(200).json(actions);
    }
);

export const getActionById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const action: Action | null = await Action.findOne({
            where: {
                action_id: req.params.id
            }
        });

        if (!action) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(action);
    }
);

export const getActionByServiceId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const actions: Action[] = await Action.findAll({
            where: {
                service_id: req.params.id
            }
        });

        if (!actions) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(actions);
    }
);

export const createAction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.service_id ||
            !req.body.name ||
            !req.body.token_required
        ) {
            res.status(400).json({message: 'Name parameter is missing.'});
            return;
        }

        const action: Action = await Action.create({
            service_id: req.body.service_id,
            name: req.body.name,
            token_required: req.body.token_required,
            description: req.body.description,
            arguments: req.body.arguments
        });
        res.status(201).json(action);
    }
);

export const updateAction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.service_id ||
            !req.body.name ||
            !req.body.token_required ||
            !req.params.id
        ) {
            res.status(400).json({message: 'ID or name parameter is missing.'});
            return;
        }

        const result: [affectedCount: number] = await Action.update(
            {
                service_id: req.body.service_id,
                name: req.body.name,
                token_required: req.body.token_required,
                description: req.body.description,
                arguments: req.body.arguments
            },
            {
                where: {
                    action_id: req.params.id
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
            action_id: req.params.id,
            service_id: req.body.service_id,
            name: req.body.name,
            token_required: req.body.token_required,
            description: req.body.description,
            arguments: req.body.arguments
        });
    }
);

export const deleteAction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const result: number | null = await Action.destroy({
            where: {
                action_id: req.params.id
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
