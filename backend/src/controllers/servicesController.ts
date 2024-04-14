import {Request, Response} from 'express';
import Service from '../models/service.model';
import * as asyncHandler from 'express-async-handler';

export const getAllServices = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const result: Service[] = await Service.findAll();
        res.status(200).json(result);
    }
);

export const getServiceById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const service: Service | null = await Service.findOne({
            where: {
                service_id: req.params.id
            }
        });

        if (!service) {
            res.status(404).json({
                message: `Could not find service with id ${req.params.id}.`
            });
            return;
        }
        res.status(200).json(service);
    }
);

export const createService = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req.body.name) {
            res.status(400).json({message: 'Name parameter is missing.'});
            return;
        }

        const service: Service = await Service.create({
            name: req.body.name
        });
        res.status(201).json(service);
    }
);

export const updateService = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (
            !req.body ||
            !req.body.id ||
            !req.body.name ||
            !req.params ||
            !req.params.id
        ) {
            res.status(400).json({message: 'ID or name parameter is missing.'});
            return;
        }
        if (req.body.id != req.params.id) {
            res.status(400).json({
                message: 'Body ID and query ID parameters are different.'
            });
            return;
        }

        const result: [affectedCount: number] = await Service.update(
            {
                service_id: req.body.id,
                name: req.body.name
            },
            {
                where: {
                    service_id: req.params.id
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
            service_id: req.body.id,
            name: req.body.name
        });
    }
);

export const deleteService = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params || !req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({message: 'Wrong id parameter.'});
            return;
        }

        const result: number | null = await Service.destroy({
            where: {
                service_id: req.params.id
            }
        });

        if (!result) {
            res.status(404).json({
                message: `Could not find service with id ${req.params.id}.`
            });
            return;
        }
        res.status(204).send();
    }
);
