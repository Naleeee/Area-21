import axios from 'axios';

export default async function (req: any, res: any): Promise<any> {
  const {code}: {code: string} = req.query;
  const data: any = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };

  try {
    const response: any = await axios.post(
      'https://github.com/login/oauth/access_token',
      data,
      {headers: {Accept: 'application/json'}}
    );

    const access_token: string = response.data.access_token;
    const refresh_token: string = response.data.refresh_token;

    res.status(200).json({access_token, refresh_token});
    return response.data;
  } catch (error) {
    console.error(error);

    res.status(400).json({message: 'Failed to get access token'});
  }
}
