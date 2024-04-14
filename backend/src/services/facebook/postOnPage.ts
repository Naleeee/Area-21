import Service from '../../models/service.model';
import Oauth from '../../models/OAuth.model';
import Area from '../../models/area.model';
import axios from 'axios';

type Post_info = {
    pageAccessToken: string;
    pageId: string;
};

async function getPostId(accessToken: string) {
    const data: Post_info = {pageAccessToken: '', pageId: ''};
    try {
        const pageId = await axios.get(
            `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`
        );
        if (
            pageId &&
            pageId.data.data &&
            pageId.data.data[0].access_token &&
            pageId.data.data[0].id
        ) {
            data.pageId = pageId.data.data[0].id;
            data.pageAccessToken = pageId.data.data[0].access_token;
        }
    } catch (e) {
        console.log('error when trying to get the postID');
    }
    return data;
}

export async function postOnPage(area_id: string) {
    const userArea: Area | null = await Area.findOne({
        where: {
            area_id: area_id
        }
    });
    if (
        userArea == null ||
        userArea.get().reaction_arguments == null ||
        userArea.get().reaction_arguments.message == null
    )
        return;

    const facebook: Service | null = await Service.findOne({
        where: {
            name: 'facebook'
        }
    });
    if (facebook == null) return;

    const userOauth: Oauth | null = await Oauth.findOne({
        where: {
            user_id: userArea.get().user_id,
            service_id: facebook.get().service_id
        }
    });
    if (userOauth == null) return;

    const postData: Post_info = await getPostId(userOauth.get().token);

    try {
        await axios.post(
            `https://graph.facebook.com/v16.0/${postData.pageId}/feed?message=${
                userArea.get().reaction_arguments.message
            }&access_token=${postData.pageAccessToken}`
        );
    } catch (e) {
        console.log('error when trying to post facebook page');
    }
}
