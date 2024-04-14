import {Request, Response} from 'express';
import Area from '../models/area.model';
import * as asyncHandler from 'express-async-handler';

export const getAllAreas = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const areas: Area[] = await Area.findAll();
        res.status(200).json(areas);
    }
);

export const getAreaById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Missing or wrong id parameter.'});
            return;
        }

        const area: Area | null = await Area.findOne({
            where: {
                area_id: req.params.id
            }
        });
        if (!area) {
            res.status(404).json({
                message: `Could not find area with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(area);
    }
);

export const getAreaByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Missing or wrong id parameter.'});
            return;
        }

        const area: Area[] = await Area.findAll({
            where: {
                user_id: req.params.id
            }
        });
        if (!area) {
            res.status(404).json({
                message: `Could not find area created by userid :${req.params.id}.`
            });
            return;
        }
        res.status(200).json(area);
    }
);

export const createArea = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.user_id ||
            !req.body.action_id ||
            !req.body.reaction_id
        ) {
            res.status(400).json({message: 'Body content is incomplete.'});
            return;
        }

        const area: Area = await Area.create({
            title: req.body.title,
            user_id: req.body.user_id, //TODO: Replace with id from user executing the request
            action_id: req.body.action_id,
            reaction_id: req.body.reaction_id,
            action_arguments: req.body.action_arguments,
            reaction_arguments: req.body.reaction_arguments
        });
        res.status(201).json(area);
    }
);
export const updateArea = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.params.id ||
            !req.body.title ||
            !req.body.action_id ||
            !req.body.reaction_id ||
            !req.body.action_arguments ||
            !req.body.reaction_arguments
        ) {
            res.status(400).json({
                message:
                    'Missing body arguments we need : title, action_id, reaction_id, action_arguments, reaction_arguments'
            });
            return;
        }

        const affectedRow = await Area.update(
            {
                title: req.body.title,
                action_id: req.body.action_id,
                reaction_id: req.body.reaction_id,
                action_arguments: req.body.action_arguments,
                reaction_arguments: req.body.reaction_arguments,
                action_data: null
            },
            {
                where: {
                    area_id: req.params.id
                }
            }
        );
        if (affectedRow[0] === 0) {
            res.status(404).json({message: 'area_id not found'});
            return;
        }
        res.status(200).json({
            title: req.body.title,
            action_id: req.body.action_id,
            reaction_id: req.body.reaction_id,
            action_arguments: req.body.action_arguments,
            reaction_arguments: req.body.reaction_arguments
        });
    }
);

export const deleteArea = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Missing or wrong id parameter.'});
            return;
        }

        const result: number | null = await Area.destroy({
            where: {
                area_id: req.params.id
            }
        });

        if (!result) {
            res.status(404).json({
                message: `Could not find area with id ${req.params.id}.`
            });
            return;
        }
        res.status(204).send();
    }
);
