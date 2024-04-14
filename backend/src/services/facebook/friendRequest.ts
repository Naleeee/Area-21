import Service from '../../models/service.model';
import Oauths from '../../models/OAuth.model';
import Area from '../../models/area.model';
import axios from 'axios';

type Facebook_data = {
    number_of_friend: number;
};

async function updateFriendNumber(area_id: string, action_data: Facebook_data) {
    await Area.update(
        {
            action_data: action_data
        },
        {
            where: {
                area_id: area_id
            }
        }
    );
}

export async function friendRequestIsReceived(area_id: string) {
    const serviceFacebook: Service | null = await Service.findOne({
        where: {
            name: 'facebook'
        }
    });
    const areaFacebook: Area | null = await Area.findOne({
        where: {
            area_id: area_id
        }
    });
    const oauthToken: Oauths | null = await Oauths.findOne({
        where: {
            user_id: areaFacebook?.get().user_id,
            service_id: serviceFacebook?.get().service_id
        }
    });

    if (serviceFacebook == null || areaFacebook == null || oauthToken == null)
        return false;

    let currentFriend;
    let saveFriends = areaFacebook.get().action_data;
    try {
        currentFriend = await axios.get(
            'https://graph.facebook.com/v16.0/me/friends',
            {
                headers: {
                    Authorization: `Bearer ${oauthToken?.get().token}`
                }
            }
        );

        if (
            (saveFriends == null || saveFriends.number_of_friend == null) &&
            currentFriend != undefined
        ) {
            saveFriends = {
                number_of_friend: currentFriend.data.summary.total_count
            };
            await updateFriendNumber(area_id, saveFriends);
            return false;
        } else if (
            currentFriend &&
            currentFriend.data.summary.total_count !=
                saveFriends.number_of_friend
        ) {
            saveFriends.number_of_friend =
                currentFriend.data.summary.total_count;
            await updateFriendNumber(area_id, saveFriends);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log('facebook error with api', e);
        return false;
    }
}
