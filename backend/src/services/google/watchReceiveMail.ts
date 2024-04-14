import OAuth from '../../models/OAuth.model';
import Service from '../../models/service.model';
import axios from 'axios';
import Area from '../../models/area.model';
import {refreshGoogleToken} from '../utils/refreshToken';

type Action_data = {
    number_of_mail: number;
};

async function updateMailNumber(area_id: string, action_data: Action_data) {
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

async function getUserToken(user_id: string, service_id: string) {
    const oauthToken: OAuth | null = await OAuth.findOne({
        where: {
            user_id: user_id,
            service_id: service_id
        }
    });
    return oauthToken;
}

export async function newMailIsReceived(
    user_id: string,
    action_id: string,
    area_id: string
) {
    const serviceGmail: Service | null = await Service.findOne({
        where: {
            name: 'google'
        }
    });
    const areaDb: Area | null = await Area.findOne({
        where: {
            area_id: area_id
        }
    });

    if (!areaDb || !serviceGmail) return false;
    let oauthTokens: OAuth | null = await getUserToken(
        user_id,
        serviceGmail?.get().service_id
    );
    let action_data = areaDb?.get().action_data;

    if (
        !oauthTokens ||
        !oauthTokens.get().token ||
        !oauthTokens.get().refresh_token
    )
        return false;

    await refreshGoogleToken(user_id, oauthTokens);

    oauthTokens = await getUserToken(user_id, serviceGmail?.get().service_id);
    let totalInbox;
    let totalTrash;
    try {
        totalInbox = await axios.get(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=label:INBOX',
            {
                headers: {
                    Authorization: `Bearer ${oauthTokens?.get().token}`
                }
            }
        );
        totalTrash = await axios.get(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=label:TRASH',
            {
                headers: {
                    Authorization: `Bearer ${oauthTokens?.get().token}`
                }
            }
        );
    } catch (e) {
        console.log('Error on watchReceiveMail google : ', e);
    }

    const total_email: number =
        totalInbox?.data.resultSizeEstimate +
        totalTrash?.data.resultSizeEstimate;

    if ((!action_data || !action_data.number_of_mail) && total_email) {
        action_data = {number_of_mail: total_email};
        await updateMailNumber(area_id, action_data);
        return false;
    } else if (total_email && action_data.number_of_mail !== total_email) {
        action_data.number_of_mail = total_email;
        await updateMailNumber(area_id, action_data);
        return true;
    } else {
        return false;
    }
}
