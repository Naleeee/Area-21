import {Request, Response} from 'express';
import Reaction from '../models/reaction.model';
import * as asyncHandler from 'express-async-handler';

export const getAllReactions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const reactions: Reaction[] = await Reaction.findAll();
        res.status(200).json(reactions);
    }
);

export const getReactionById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const reaction: Reaction | null = await Reaction.findOne({
            where: {
                reaction_id: req.params.id
            }
        });

        if (!reaction) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(reaction);
    }
);

export const getReactionByServiceId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const reactions: Reaction[] | null = await Reaction.findAll({
            where: {
                service_id: req.params.id
            }
        });

        if (!reactions) {
            res.status(404).json({
                message: `Could not find action with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(reactions);
    }
);

export const createReaction = asyncHandler(
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

        const reaction: Reaction = await Reaction.create({
            service_id: req.body.service_id,
            name: req.body.name,
            token_required: req.body.token_required,
            description: req.body.description,
            arguments: req.body.arguments
        });
        res.status(201).json(reaction);
    }
);

export const updateReaction = asyncHandler(
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

        const result: [affectedCount: number] = await Reaction.update(
            {
                service_id: req.body.service_id,
                name: req.body.name,
                token_required: req.body.token_required,
                description: req.body.description,
                arguments: req.body.arguments
            },
            {
                where: {
                    reaction_id: req.params.id
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

export const deleteReaction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const result: number | null = await Reaction.destroy({
            where: {
                reaction_id: req.params.id
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
