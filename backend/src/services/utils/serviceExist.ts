import Service from '../../models/service.model';

export async function weatherServiceExistOrCreate(): Promise<Service> {
    const [service, created] = await Service.findOrCreate({
        where: {
            name: 'weather'
        }
    });
    if (created) return service;

    return service;
}
