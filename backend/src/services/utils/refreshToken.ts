import OAuth from '../../models/OAuth.model';
import Service from '../../models/service.model';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import * as spotify from './spotify';
import * as github from './github';
import axiosRequestWrapper from '../../utils/axios';

export async function refreshGoogleToken(
    user_id: string,
    oauthTokens: OAuth | null
) {
    let response: any;
    const serviceGoogle: Service | null = await Service.findOne({
        where: {
            name: 'google'
        }
    });
    try {
        response = await axios.post(
            'https://www.googleapis.com/oauth2/v4/token',
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: oauthTokens?.get().refresh_token,
                grant_type: 'refresh_token'
            }
        );
    } catch (err) {
        console.log('we have an error in refresh token method', err);
        return;
    }

    if (!response.data.access_token) return;

    await OAuth.update(
        {
            token: response.data.access_token
        },
        {
            where: {
                user_id: user_id,
                service_id: serviceGoogle?.get().service_id
            }
        }
    );
}

export const refreshSpotifyToken = async (userId: string): Promise<void> => {
    const spotifyService: Service | null = await spotify.getSpotifyService();
    const OAuthTokens: OAuth | null = await spotify.getUserTokens(userId);
    if (!spotifyService || !OAuthTokens) return;
    const refreshToken: string = await OAuthTokens.get().refresh_token;

    const config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        console.log(
            `An error occurred in refreshSpotifyToken with status code ${response.response.status}`
        );
        return;
    }
    const newToken = (response as AxiosResponse).data.access_token;
    await OAuth.update(
        {
            token: newToken
        },
        {
            where: {
                user_id: userId,
                service_id: spotifyService.get().service_id
            }
        }
    );
};

export const refreshGithubToken = async (userId: string): Promise<void> => {
    const githubService: Service | null = await github.getGithubService();
    const OAuthTokens: OAuth | null = await github.getUserTokens(userId);
    if (!githubService || !OAuthTokens) return;
    const refreshToken: string = await OAuthTokens.get().refresh_token;

    const config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET
        }
    };

    const response: AxiosResponse | AxiosError = await axiosRequestWrapper(
        config
    );
    if (axios.isAxiosError(response) && response.response) {
        console.log(
            `An error occurred while refreshing github token with status code ${response.response.status}`
        );
        return;
    }
    const newToken = (response as AxiosResponse).data.access_token;
    const newRefreshToken = (response as AxiosResponse).data.refresh_token;
    if (!newToken || !newRefreshToken) return;
    await OAuth.update(
        {
            token: newToken,
            refresh_token: newRefreshToken
        },
        {
            where: {
                user_id: userId,
                service_id: githubService.get().service_id
            }
        }
    );
};
