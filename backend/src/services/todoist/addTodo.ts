import axios from 'axios';
import Area from '../../models/area.model';
import Service from '../../models/service.model';
import Oauth from '../../models/OAuth.model';

export const addTodo = async (areaId: string) => {
    const userArea: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (
        userArea == null ||
        userArea.get().reaction_arguments == null ||
        userArea.get().reaction_arguments.content == null
    )
        return;

    const todoist: Service | null = await Service.findOne({
        where: {
            name: 'todoist'
        }
    });
    if (todoist == null) return;

    const userOauth: Oauth | null = await Oauth.findOne({
        where: {
            user_id: userArea.get().user_id,
            service_id: todoist.get().service_id
        }
    });
    if (userOauth == null || userOauth.get().token == null) return;

    if (userArea.get().reaction_arguments.content == null) return;

    try {
        await axios.post(
            'https://api.todoist.com/rest/v2/tasks',
            {
                content: userArea.get().reaction_arguments.content
            },
            {
                headers: {
                    Authorization: `Bearer ${userOauth.get().token}`
                }
            }
        );
    } catch (e) {
        console.log('error when trying to add new task on todoist');
    }
};
