import OAuth from '../../models/OAuth.model';
import Service from '../../models/service.model';
import Area from '../../models/area.model';

export const getGithubService = async (): Promise<Service | null> => {
    const githubService: Service | null = await Service.findOne({
        where: {
            name: 'github'
        }
    });

    if (!githubService) {
        console.log("Couldn't retrieve github service");
        return null;
    }
    return githubService;
};

export const getUserTokens = async (userId: string): Promise<OAuth | null> => {
    const githubService: Service | null = await getGithubService();

    if (!githubService) return null;
    const githubServiceId: string = githubService.get().service_id;

    return await OAuth.findOne({
        where: {
            user_id: userId,
            service_id: githubServiceId
        }
    });
};

export const getRepositoryUrl = async (
    areaId: string
): Promise<string | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (!area || !area.get().action_arguments) return null;
    return area.get().action_arguments.repositoryUrl;
};
