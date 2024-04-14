import {refreshGoogleToken} from '../utils/refreshToken';
import Area from '../../models/area.model';
import OAuth from '../../models/OAuth.model';
import Service from '../../models/service.model';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

export async function sendMail(area_id: string) {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: area_id
        }
    });
    const service: Service | null = await Service.findOne({
        where: {
            name: 'google'
        }
    });

    const token: OAuth | null = await OAuth.findOne({
        where: {
            user_id: area?.get().user_id,
            service_id: service?.get().service_id
        }
    });

    await refreshGoogleToken(area?.get().user_id, token);

    const oauth_email = await axios.get(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile',
        {
            headers: {
                Authorization: `Bearer ${token?.get().token}`
            }
        }
    );
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: `${oauth_email?.data.emailAddress}`,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: token?.get().refresh_token,
                accessToken: token?.get().token
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'AREA21',
            to: `${area?.get().reaction_arguments.to}`,
            subject: `${area?.get().reaction_arguments.subject}`,
            text: `${area?.get().reaction_arguments.text}`
        };
        await transport.sendMail(mailOptions);
    } catch (err) {
        console.log('we have an error', err);
    }
}
