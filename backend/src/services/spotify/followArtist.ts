import OAuth from '../../models/OAuth.model';
import * as spotify from '../utils/spotify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import axiosRequestWrapper from '../../utils/axios';
import {refreshSpotifyToken} from '../utils/refreshToken';

type CurrentTrackResponse = {
    item: {
        artists: Array<Artist>;
    };
};

type Artist = {
    followers: {
        href: string;
        total: number;
    };
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    name: string;
    popularity: number;
    type: string;
    uri: string;
};

export const followCurrentTrackArtists = async (
    userId: string
): Promise<void> => {
    const OAuthTokens: OAuth | null = await spotify.getUserTokens(userId);
    if (!OAuthTokens) return;
    const userToken: string = OAuthTokens.get().token;
    const currentTrackArtists: Array<Artist> | null =
        await getCurrentTrackArtists(userId, userToken);
    if (!currentTrackArtists) return;

    const currentTrackArtistsIds: Array<string> = [];
    for (const artist of currentTrackArtists)
        currentTrackArtistsIds.push(artist.id);

    const config: AxiosRequestConfig = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/following',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
        },
        params: {
            ids: currentTrackArtistsIds.toString(),
            type: 'artist'
        },
        data: {
            ids: currentTrackArtistsIds
        }
    };

    let response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        if (response.response.status !== 401) {
            console.log(
                `An error occurred in followCurrentTrackArtists with status code ${response.response.status}`
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
                `An error occurred in followCurrentTrackArtists with status code ${response.response.status}`
            );
            return;
        }
    }
};

const getCurrentTrackArtists = async (
    userId: string,
    userToken: string
): Promise<Array<Artist> | null> => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
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
                `An error occurred in getCurrentTrackArtists with status code ${response.response.status}`
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
                `An error occurred in getCurrentTrackArtists with status code ${response.response.status}`
            );
            return null;
        }
    }

    const data = (response as AxiosResponse).data;
    if (!data) {
        console.log("Couldn't retrieve current track artist(s)");
        return null;
    }
    return (data as CurrentTrackResponse).item.artists;
};
