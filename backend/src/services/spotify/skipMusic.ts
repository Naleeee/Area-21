import * as spotify from '../utils/spotify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {refreshSpotifyToken} from '../utils/refreshToken';
import OAuth from '../../models/OAuth.model';
import axiosRequestWrapper from '../../utils/axios';

export const skipMusic = async (
    areaId: string,
    userId: string
): Promise<void> => {
    const OAuthTokens: OAuth | null = await spotify.getUserTokens(userId);
    if (!OAuthTokens) return;
    const userToken = OAuthTokens.get().token;
    const config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/next',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
        }
    };

    let response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        if (response.response.status !== 401) {
            console.log(
                `An error occurred in skipMusic with status code ${response.response.status}`
            );
            return;
        }
        await refreshSpotifyToken(userId);
        response = await axiosRequestWrapper(config);
        if (
            axios.isAxiosError(response) &&
            response.response &&
            response.response.status === 401
        ) {
            console.log(
                `An error occurred in skipMusic with status code ${response.response.status}`
            );
            return;
        }
    }
};
