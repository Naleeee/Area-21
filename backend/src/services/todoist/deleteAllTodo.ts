import axios from 'axios';
import Area from '../../models/area.model';
import Service from '../../models/service.model';
import Oauth from '../../models/OAuth.model';

export const deleteAllTodo = async (areaId: string) => {
    const userArea: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (userArea == null) return;

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

    let allTodo: any;

    try {
        allTodo = await axios.get('https://api.todoist.com/rest/v2/tasks', {
            headers: {
                Authorization: `Bearer ${userOauth.get().token}`
            }
        });
        allTodo = allTodo.data;
        for (const todo of allTodo) {
            try {
                await axios.delete(
                    `https://api.todoist.com/rest/v2/tasks/${todo.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${userOauth.get().token}`
                        }
                    }
                );
            } catch (e) {
                console.log('error when deleting a todo');
            }
        }
    } catch (e) {
        console.log('error when deleting all todo');
    }
};
