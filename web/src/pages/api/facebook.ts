export default async (req: any, res: any): Promise<any> => {
  const {code}: {code: string} = req.query;
  fetch('https://graph.facebook.com/v10.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: process.env.NEXTAUTH_URL + '/services?from=facebook',
    }),
  })
    .then((response: Response) => response.json())
    .then((data: any) => {
      res.status(200).json({access_token: data.access_token});
    })
    .catch(error => {
      res.status(400).json({message: 'Failed to get access token', error});
    });
};
