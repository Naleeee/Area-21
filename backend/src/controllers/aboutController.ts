import * as asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';

export const getAbout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        // @ts-ignore
        let ipUser = (req.ipInfo.ip.split(":",)[3])
        const time = Math.floor(Date.now() / 1000);

        if (ipUser == null) ipUser ="127.0.0.1";

        const data = {
            "client": {
                "host": ipUser
            },
            "server": {
                "current_time": time,
                "services": [{
                    "name":"google",
                    "actions": [{
                        "name": "updateOnMail",
                        "description": "See if new mail is received",
                        "params": ""
                    }],
                    "reactions": [{
                        "name":"sendMail",
                        "description":"Send a mail",
                        "params":"{\n" +
                            "    \"to\": \"\",\n" +
                            "    \"text\": \"\",\n" +
                            "    \"subject\": \"\"\n" +
                            "}"
                    }]
                },{
                    "name":"weather",
                    "actions":[{
                        "name": "temperature",
                        "description": "see if temperature is higher than the limit",
                        "params": "{\n" +
                            "    \"city\": \"\",\n" +
                            "    \"temperature\": \"\"\n" +
                            "}"
                    },{
                        "name": "wind",
                        "description": "see if wind force is higher than the limit",
                        "params": "{\n" +
                            "    \"city\": \"\",\n" +
                            "    \"wind\": \"\"\n" +
                            "}"
                    },{
                        "name": "humidity",
                        "description": "see if humidity is higher than the limit",
                        "params": "{\n" +
                            "    \"city\": \"\",\n" +
                            "    \"humidity\": \"\"\n" +
                            "}"
                    }],
                    "reactions":[]
                },{
                    "name":"facebook",
                    "actions":[{
                        "name":"facebookFriends",
                        "description": "see if the friend list perform an update",
                        "params":""
                    }],
                    "reactions": [{
                        "name":"postOnPage",
                        "description": "Create a post on facebook page",
                        "params": "{\n" +
                            "    \"message\": \"\"\n" +
                            "}"
                    }]
                },{
                    "name":"todoist",
                    "actions":[],
                    "reactions":[{
                        "name":"createTodo",
                        "description": "Create a new todo",
                        "params": "{\n" +
                            "    \"content\": \"\"\n" +
                            "}"
                    },{
                        "name":"deleteAllTodo",
                        "description":"Delete all the todo",
                        "params":""
                    }]
                },{
                    "name":"spotify",
                    "actions":[{
                        "name":"watchPlaybackState",
                        "description":"Check if the current track was paused/resumed",
                        "params":""
                    }],
                    "reactions":[{
                        "name":"switchPlaybackState",
                        "description":"Pause/resume the current track",
                        "params":""
                    },{
                        "name":"skipMusic",
                        "description": "Skip the current music playing",
                        "params":""
                    }]
                },{
                    "name":"github",
                    "actions":[{
                        "name":"repositoryStarred",
                        "description":"Check if a given Github repository has been starred",
                        "params":"{\n" +
                            "    \"repositoryUrl\": \"\"\n" +
                            "}"
                    },{
                        "name":"newPullRequest",
                        "description":"Check if a pull request has been opened on a given Github repository",
                        "params":"{\n" +
                            "    \"repositoryUrl\": \"\"\n" +
                            "}"
                    }],
                    "reactions":[{
                        "name":"followCurrentTrackArtists",
                        "description":"Follow the current playing track artists",
                        "params":""
                    }]
                }]
            }
        }
        res.status(200).json(data);
    }
);
