import OAuth from '../../models/OAuth.model';
import * as github from '../utils/github';
import axios, {AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import axiosRequestWrapper from '../../utils/axios';
import {refreshGithubToken} from '../utils/refreshToken';
import Area from '../../models/area.model';

export const createIssue = async (
    areaId: string,
    userId: string
): Promise<boolean> => {
    const OAuthTokens: OAuth | null = await github.getUserTokens(userId);
    if (!OAuthTokens) return false;
    const userToken: string = OAuthTokens.get().token;
    const repositoryUrl: string | null = await getRepositoryUrl(areaId);
    const issueTitle: string | null = await getIssueTitle(areaId);
    if (!repositoryUrl || !issueTitle) return false;

    const slug = repositoryUrl.replace('https://github.com/', '');
    const owner = slug.split('/').at(0);
    const repository = slug.split('/').at(1);

    const config: AxiosRequestConfig = {
        method: 'post',
        url: `https://api.github.com/repos/${owner}/${repository}/issues`,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${userToken}`,
            'X-GitHub-Api-Version': '2022-11-28'
        },
        data: {
            title: issueTitle
        }
    };

    let response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        if (response.response.status !== 401) {
            console.log(
                `An error occurred in createIssue with status code ${response.response.status}`
            );
            return false;
        }
        await refreshGithubToken(userId);
        response = await axiosRequestWrapper(config);
        if (
            axios.isAxiosError(response) &&
            response.response &&
            response.response.status === 401
        ) {
            console.log(
                `An error occurred in createIssue with status code ${response.response.status}`
            );
            return false;
        }
    }
    return true;
};

const getRepositoryUrl = async (areaId: string): Promise<string | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (!area || !area.get().reaction_arguments) return null;
    return area.get().reaction_arguments.repositoryUrl;
};

const getIssueTitle = async (areaId: string): Promise<string | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });
    if (!area || !area.get().reaction_arguments) return null;
    return area.get().reaction_arguments.title;
};
