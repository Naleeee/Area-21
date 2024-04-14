import OAuth from '../../models/OAuth.model';
import Area from '../../models/area.model';
import * as spotify from '../utils/spotify';

export const watchPlaybackState = async (
    userId: string,
    areaId: string
): Promise<boolean> => {
    const OAuthTokens: OAuth | null = await spotify.getUserTokens(userId);
    const userToken: string = OAuthTokens?.get().token;

    if (!userToken) return false;

    const playbackState: spotify.PlaybackStateResponse | null =
        await spotify.getPlaybackState(userId, userToken);
    if (!playbackState) return false;

    const previousPlayerState: boolean | null = await getPreviousPlayerState(
        areaId
    );
    if (
        previousPlayerState !== null &&
        playbackState.is_playing === previousPlayerState
    )
        return false;
    const actionData: spotify.ActionData = {
        isPlaying: playbackState.is_playing
    };
    await spotify.updatePlayerState(areaId, actionData);
    return previousPlayerState !== null;
};

const getPreviousPlayerState = async (
    areaId: string
): Promise<boolean | null> => {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });

    if (!area) {
        console.log("Couldn't retrieve area");
        return null;
    }
    return area.get().action_data
        ? JSON.parse(area.get().action_data).isPlaying
        : null;
};
