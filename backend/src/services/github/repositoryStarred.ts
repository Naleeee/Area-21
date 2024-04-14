import axiosRequestWrapper from '../../utils/axios';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import Area from '../../models/area.model';
import OAuth from '../../models/OAuth.model';
import * as github from '../utils/github';
import {refreshGithubToken} from '../utils/refreshToken';

type Stargazer = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
};

type StarsActionData = {
    stars: number;
};

export const repositoryStarred = async (
    areaId: string,
    userId: string
): Promise<boolean> => {
    const OAuthTokens: OAuth | null = await github.getUserTokens(userId);
    if (!OAuthTokens) return false;
    const userToken: string = OAuthTokens.get().token;

    const stargazers: Array<Stargazer> | null = await getStars(
        areaId,
        userId,
        userToken
    );
    if (stargazers === null) return false;

    const previousStars: number | null = await getPreviousStars(areaId);
    if (previousStars !== null && stargazers.length === previousStars)
        return false;
    const actionData: StarsActionData = {
        stars: stargazers.length
    };
    await updateStars(areaId, actionData);
    return previousStars !== null && stargazers.length > previousStars;
};

const getStars = async (
    areaId: string,
    userId: string,
    userToken: string
): Promise<Array<Stargazer> | null> => {
    const repositoryUrl: string | null = await github.getRepositoryUrl(areaId);
    if (!repositoryUrl) return null;

    const slug = repositoryUrl.replace('https://github.com/', '');
    const owner = slug.split('/').at(0);
    const repository = slug.split('/').at(1);
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://api.github.com/repos/${owner}/${repository}/stargazers`,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${userToken}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    };

    let response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        if (response.response.status !== 401) {
            console.log(
                `An error occurred in repositoryStarred with status code ${response.response.status}`
            );
            return null;
        }
        await refreshGithubToken(userId);
        response = await axiosRequestWrapper(config);
        if (
            axios.isAxiosError(response) &&
            response.response &&
            response.response.status === 401
        ) {
            console.log(
                `An error occurred in repositoryStarred with status code ${response.response.status}`
            );
            return null;
        }
    }
    const data = (response as AxiosResponse).data;
    if (!data) {
        console.log("Couldn't retrieve repository stars");
        return null;
    }
    return data;
};

const getPreviousStars = async (areaId: string): Promise<number | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (!area || !area.get().action_data) return null;
    return Number(JSON.parse(area.get().action_data).stars);
};

const updateStars = async (
    areaId: string,
    actionData: StarsActionData
): Promise<void> => {
    await Area.update(
        {
            action_data: JSON.stringify(actionData)
        },
        {
            where: {
                area_id: areaId
            }
        }
    );
};
