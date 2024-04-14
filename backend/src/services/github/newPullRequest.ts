import OAuth from '../../models/OAuth.model';
import * as github from '../utils/github';
import Area from '../../models/area.model';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import axiosRequestWrapper from '../../utils/axios';
import {refreshGithubToken} from '../utils/refreshToken';

type PullRequest = any;

type PullRequestActionData = {
    pullRequests: number;
};

export const newPullRequest = async (
    areaId: string,
    userId: string
): Promise<boolean> => {
    const OAuthTokens: OAuth | null = await github.getUserTokens(userId);
    if (!OAuthTokens) return false;
    const userToken: string = OAuthTokens.get().token;

    const pullRequests: Array<PullRequest> | null = await getPullRequests(
        areaId,
        userId,
        userToken
    );
    if (pullRequests === null) return false;

    const previousPullRequests: number | null = await getPreviousPullRequests(
        areaId
    );
    if (
        previousPullRequests !== null &&
        pullRequests.length === previousPullRequests
    )
        return false;
    const actionData: PullRequestActionData = {
        pullRequests: pullRequests.length
    };
    await updatePullRequests(areaId, actionData);
    return (
        previousPullRequests !== null &&
        pullRequests.length > previousPullRequests
    );
};

const getPullRequests = async (
    areaId: string,
    userId: string,
    userToken: string
): Promise<Array<PullRequest> | null> => {
    const repositoryUrl: string | null = await github.getRepositoryUrl(areaId);
    if (!repositoryUrl) return null;

    const slug = repositoryUrl.replace('https://github.com/', '');
    const owner = slug.split('/').at(0);
    const repository = slug.split('/').at(1);
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://api.github.com/repos/${owner}/${repository}/pulls`,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${userToken}`,
            'X-GitHub-Api-Version': '2022-11-28'
        },
        params: {
            state: 'open'
        }
    };

    let response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        if (response.response.status !== 401) {
            console.log(
                `An error occurred in getPullRequests with status code ${response.response.status}`
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
                `An error occurred in getPullRequests with status code ${response.response.status}`
            );
            return null;
        }
    }
    const data = (response as AxiosResponse).data;
    if (!data) {
        console.log("Couldn't retrieve pull requests");
        return null;
    }
    return data;
};

const getPreviousPullRequests = async (
    areaId: string
): Promise<number | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });

    if (!area || !area.get().action_data) return null;
    return Number(JSON.parse(area.get().action_data).pullRequests);
};

const updatePullRequests = async (
    areaId: string,
    actionData: PullRequestActionData
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
