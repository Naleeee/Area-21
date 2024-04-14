import Service from '../../models/service.model';
import OAuth from '../../models/OAuth.model';
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import Area from '../../models/area.model';
import {refreshSpotifyToken} from './refreshToken';
import axiosRequestWrapper from '../../utils/axios';

export type ActionData = {
    isPlaying: boolean;
};

export type PlaybackStateResponse = {
    is_playing: boolean;
};

export const getSpotifyService = async (): Promise<Service | null> => {
    const spotifyService: Service | null = await Service.findOne({
        where: {
            name: 'spotify'
        }
    });

    if (!spotifyService) {
        console.log("Couldn't retrieve spotify service");
        return null;
    }
    return spotifyService;
};

export const getUserTokens = async (userId: string): Promise<OAuth | null> => {
    const spotifyService: Service | null = await getSpotifyService();

    if (!spotifyService) return null;
    const spotifyServiceId: string = spotifyService.get().service_id;

    return await OAuth.findOne({
        where: {
            user_id: userId,
            service_id: spotifyServiceId
        }
    });
};

export const getPlaybackState = async (
    userId: string,
    userToken: string
): Promise<PlaybackStateResponse | null> => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player',
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
                `An error occurred in getPlaybackState with status code ${response.response.status}`
            );
            return null;
        }
        await refreshSpotifyToken(userId);
        response = await axiosRequestWrapper(config);
        if (
            axios.isAxiosError(response) &&
            response.response &&
            response.response.status === 401
        ) {
            console.log(
                `An error occurred in getPlaybackState with status code ${response.response.status}`
            );
            return null;
        }
    }

    const data = (response as AxiosResponse).data;
    if (!data) {
        console.log("Couldn't retrieve spotify playback state");
        return null;
    }
    return data;
};

export const updatePlayerState = async (
    areaId: string,
    actionData: ActionData
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
