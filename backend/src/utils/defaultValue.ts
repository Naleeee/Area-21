import Service from '../models/service.model';
import Action from '../models/action.model';
import Reaction from '../models/reaction.model';

async function setupService() {
    const services: Array<string> = [
        'google',
        'weather',
        'facebook',
        'todoist',
        'spotify',
        'github'
    ];
    for (let i = 1; i <= services.length; i++) {
        await Service.findOrCreate({
            where: {
                name: services[i - 1]
            },
            defaults: {
                service_id: i,
                name: services[i - 1]
            }
        });
    }
}

async function setupAction() {
    const serviceId: Array<number> = [1, 2, 2, 2, 3, 5, 6, 6];
    const actions: Array<string> = [
        'updateOnMail',
        'temperature',
        'wind',
        'humidity',
        'facebookFriends',
        'watchPlaybackState',
        'repositoryStarred',
        'newPullRequest'
    ];
    const tokenRequire: Array<boolean> = [
        true,
        false,
        false,
        false,
        true,
        true,
        true,
        true
    ];
    const descriptions: Array<string> = [
        'See if new mail is received',
        'see if temperature is higher than the limit',
        'see if wind force is higher than the limit',
        'see if humidity is higher than the limit',
        'see if the friend list perform an update',
        'Check if the current track was paused/resumed',
        'Check if a given Github repository has been starred',
        'Check if a pull request has been opened on a given Github repository'
    ];
    const params: Array<any> = [
        null,
        {city: '', temperature: ''},
        {city: '', wind: ''},
        {
            city: '',
            humidity: ''
        },
        null,
        null,
        {repositoryUrl: ''},
        {repositoryUrl: ''}
    ];

    for (let i = 1; i <= actions.length; i++) {
        await Action.findOrCreate({
            where: {
                name: actions[i - 1]
            },
            defaults: {
                action_id: i,
                service_id: serviceId[i - 1],
                name: actions[i - 1],
                token_required: tokenRequire[i - 1],
                description: descriptions[i - 1],
                arguments: params[i - 1]
            }
        });
    }
}

async function setupReaction() {
    const serviceId: Array<number> = [1, 3, 4, 4, 5, 5, 5];
    const reactionName: Array<string> = [
        'sendMail',
        'postOnPage',
        'createTodo',
        'deleteAllTodo',
        'switchPlaybackState',
        'followCurrentTrackArtists',
        'skipMusic'
    ];
    const tokenRequire: Array<boolean> = [
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ];
    const descriptions: Array<string> = [
        'Send a mail',
        'Create a post on facebook page',
        'Create a new todo',
        'Delete all the todo',
        'Pause/resume the current track',
        'Follow the current playing track artists',
        'Skip the current music playing'
    ];
    const params: Array<any> = [
        {to: '', subject: '', text: ''},
        {message: ''},
        {content: ''},
        null,
        null,
        null,
        null
    ];

    for (let i = 1; i <= reactionName.length; i++) {
        await Reaction.findOrCreate({
            where: {
                name: reactionName[i - 1]
            },
            defaults: {
                reaction_id: i,
                service_id: serviceId[i - 1],
                name: reactionName[i - 1],
                token_required: tokenRequire[i - 1],
                description: descriptions[i - 1],
                arguments: params[i - 1]
            }
        });
    }
}

export const setupDb = async () => {
    await setupService();
    await setupAction();
    await setupReaction();
};
