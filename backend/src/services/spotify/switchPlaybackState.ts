import * as spotify from '../utils/spotify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {refreshSpotifyToken} from '../utils/refreshToken';
import OAuth from '../../models/OAuth.model';
import axiosRequestWrapper from '../../utils/axios';

export const switchPlaybackState = async (
    userId: string,
    areaId: string
): Promise<void> => {
    const OAuthTokens: OAuth | null = await spotify.getUserTokens(userId);
    if (!OAuthTokens) return;
    const userToken = OAuthTokens.get().token;

    const playbackState: spotify.PlaybackStateResponse | null =
        await spotify.getPlaybackState(userId, userToken);
    if (!playbackState) return;

    playbackState.is_playing
        ? await pause(areaId, userId, userToken)
        : await resume(areaId, userId, userToken);
};

const resume = async (
    areaId: string,
    userId: string,
    userToken: string
): Promise<void> => {
    const config: AxiosRequestConfig = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
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
                `An error occurred in resume with status code ${response.response.status}`
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
                `An error occurred in resume with status code ${response.response.status}`
            );
            return;
        }
    }
};

const pause = async (
    areaId: string,
    userId: string,
    userToken: string
): Promise<void> => {
    const config: AxiosRequestConfig = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
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
                `An error occurred in pause with status code ${response.response.status}`
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
                `An error occurred in pause with status code ${response.response.status}`
            );
            return;
        }
    }
};
