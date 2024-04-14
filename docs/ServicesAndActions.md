# Services, actions and reactions

## Web and mobile OAuth documentations

[Web documentation](https://next-auth.js.org/providers/)

[Mobile documentation](https://docs.expo.dev/guides/authentication/)

## Services list

- Spotify
- Google
- GitHub
- Facebook
- TodoIst
- Weather

## Actions and reactions list

| Service  |        Actions / Reaction        | Action | Reaction | Documentation reference link                                                                                                                                                                             |
|:--------:|:--------------------------------:|:------:|:--------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Spotify  |     Track is paused/resumed      |   ✓    |          | https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback                                                                              |
| Spotify  |        Resume/pause track        |        |    ✓     | https://developer.spotify.com/documentation/web-api/reference/#/operations/start-a-users-playback <br/>https://developer.spotify.com/documentation/web-api/reference/#/operations/pause-a-users-playback |
| Spotify  | Follow artist from current track |        |    ✓     | https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-artists-users                                                                                                          |
| Spotify  |      Skip the current track      |        |    ✓     | https://developer.spotify.com/documentation/web-api/reference/#/operations/skip-users-playback-to-next-track                                                                                             |
|          |                                  |        |          |                                                                                                                                                                                                          |
|  Google  |         Email reception          |   ✓    |          | https://developers.google.com/gmail/api/reference/rest/v1/users/watch                                                                                                                                    |
|  Google  |            Send email            |        |    ✓     | https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send                                                                                                                            |
|          |                                  |        |          |                                                                                                                                                                                                          |
| Facebook |     Friend request reception     |   ✓    |          | https://developers.facebook.com/docs/graph-api/reference/v15.0/user/friendrequests                                                                                                                       |
| Facebook |         Create new post          |        |    ✓     | https://developers.facebook.com/docs/graph-api/reference/post/                                                                                                                                           |
|          |                                  |        |          |                                                                                                                                                                                                          |
|  Github  |    Someone stars a repository    |   ✓    |          | https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#list-stargazers                                                                                                                  |
|  Github  |     New pull request opened      |   ✓    |          | https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests                                                                                                                     |
|  Github  |           Create issue           |        |    ✓     | https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue                                                                                                                      |
|          |                                  |        |          |                                                                                                                                                                                                          |
| TodoIst  |           Add new todo           |        |    ✓     | https://developer.todoist.com/rest/v2/#create-a-new-task                                                                                                                                                 |
| TodoIst  |         Delete all todos         |        |    ✓     | https://developer.todoist.com/rest/v2/#delete-a-task                                                                                                                                                     |
|          |                                  |        |          |                                                                                                                                                                                                          |
| Weather  |           Temperature            |   ✓    |          | https://www.weatherapi.com/docs/                                                                                                                                                                         |
| Weather  |            Wind speed            |   ✓    |          | https://www.weatherapi.com/docs/                                                                                                                                                                         |
| Weather  |             Humidity             |   ✓    |          | https://www.weatherapi.com/docs/                                                                                                                                                                         |
