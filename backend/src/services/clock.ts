import * as express from 'express';
import {setIntervalAsync} from 'set-interval-async';

import Area from '../models/area.model';
import {newMailIsReceived} from './google/watchReceiveMail';
import {sendMail} from './google/sendMail';
import {watchPlaybackState} from './spotify/watchMusicState';
import {switchPlaybackState} from './spotify/switchPlaybackState';
import {checkTemperature} from './weather/temperature';
import {checkWind} from './weather/wind';
import {checkHumidity} from './weather/humidity';
import {friendRequestIsReceived} from './facebook/friendRequest';
import {postOnPage} from './facebook/postOnPage';
import {addTodo} from './todoist/addTodo';
import {deleteAllTodo} from './todoist/deleteAllTodo';
import {followCurrentTrackArtists} from './spotify/followArtist';
import {repositoryStarred} from './github/repositoryStarred';
import {newPullRequest} from './github/newPullRequest';
import {skipMusic} from './spotify/skipMusic';

const router: express.Router = express.Router();

setIntervalAsync(async () => {
    const areas: Area[] = await Area.findAll();

    for (const area of areas) {
        const {area_id, user_id, action_id, reaction_id} = area.get();

        const actions: any = {
            1: {
                function: newMailIsReceived,
                arguments: [user_id, action_id, area_id] as [
                    string,
                    string,
                    string
                ]
            },
            2: {
                function: checkTemperature,
                arguments: [area_id] as [string]
            },
            3: {
                function: checkWind,
                arguments: [area_id] as [string]
            },
            4: {
                function: checkHumidity,
                arguments: [area_id] as [string]
            },
            5: {
                function: friendRequestIsReceived,
                arguments: [area_id] as [string]
            },
            6: {
                function: watchPlaybackState,
                arguments: [user_id, area_id] as [string, string]
            },
            7: {
                function: repositoryStarred,
                arguments: [area_id, user_id] as [string, string]
            },
            8: {
                function: newPullRequest,
                arguments: [area_id, user_id] as [string, string]
            }
        };
        const reactions: any = {
            1: {
                function: sendMail,
                arguments: [area_id] as [string]
            },
            2: {
                function: postOnPage,
                arguments: [area_id] as [string]
            },
            3: {
                function: addTodo,
                arguments: [area_id] as [string]
            },
            4: {
                function: deleteAllTodo,
                arguments: [area_id] as [string]
            },
            5: {
                function: switchPlaybackState,
                arguments: [user_id, area_id] as [string, string]
            },
            6: {
                function: followCurrentTrackArtists,
                arguments: [user_id] as [string]
            },
            7: {
                function: skipMusic,
                arguments: [area_id, user_id] as [string, string]
            }
        };
        const actionArguments: string[] = actions[action_id].arguments;
        const reactionArguments: string[] = reactions[reaction_id].arguments;
        if (action_id > actions.length || reaction_id > reactions.length)
            return;

        if (await actions[action_id].function(...actionArguments))
            await reactions[reaction_id].function(...reactionArguments);
    }
}, 30000);

export default router;
