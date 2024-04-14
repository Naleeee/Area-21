import axios, {AxiosError} from 'axios';
import {Argument, User} from '@/types';

type CallApiReturn = {
  data: any | null;
  message: any;
  status: any;
  statusText: any | null;
  onSuccess: Boolean;
};

async function callApi(
  api: string | undefined,
  method: string,
  endpoint: string,
  token: string | null,
  data: any = null,
  inLoop: Boolean = false
): Promise<CallApiReturn> {
  const url: string = api + endpoint;

  const headers: any = {
    'Content-Type': 'application/json',
    authorization: 'Bearer ' + token,
  };

  try {
    let response: any = {};
    if (method == 'get' || method == 'delete')
      response = await axios[method](url, {headers: headers});
    else if (method == 'post' || method == 'put')
      response = await axios[method](url, data, {headers: headers});
    else throw AxiosError;

    return {
      data: response.data,
      message: null,
      status: response.status,
      statusText: null,
      onSuccess: true,
    };
  } catch (error: any) {
    if (
      error.code === 'ERR_NETWORK' &&
      error?.response?.data === undefined &&
      !inLoop
    ) {
      let newResponse: CallApiReturn = {
        data: null,
        message: error?.response?.data?.message,
        status: error.code,
        statusText: error.message,
        onSuccess: false,
      };
      const beginLoop: number = new Date().getTime();
      while (newResponse.status === 'ERR_NETWORK') {
        console.log('---- ERROR NETWORK ----');
        newResponse = await callApi(api, method, endpoint, token, data, true);
        console.log('==> status', newResponse.status);
        if (new Date().getTime() - beginLoop > 5000) break;
      }
      return newResponse;
    }
    console.log(Object.keys(error));
    console.log(error.code);
    console.log(error.message);
    console.log('Request failed: ' + endpoint);
    console.log(error?.response?.data);
    console.error(error);

    if (error?.response?.data === 'Invalid token')
      localStorage.removeItem('user');

    return {
      data: null,
      message: error?.response?.data?.message,
      status: error.code,
      statusText: error.message,
      onSuccess: false,
    };
  }
}

// Actions
export async function getAllActions(api: string | undefined, token: string) {
  const response: CallApiReturn = await callApi(api, 'get', '/actions/', token);
  if (response.onSuccess) return response.data;
  else return null;
}

// Auth
export async function tryLogin(
  api: string | undefined,
  email: string,
  password: string
) {
  const response: CallApiReturn = await callApi(
    api,
    'post',
    '/users/login',
    null,
    {
      email: email,
      password: password,
    }
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function registerUser(
  api: string | undefined,
  email: string,
  password: string
) {
  const response: CallApiReturn = await callApi(
    api,
    'post',
    '/users/register',
    null,
    {
      email: email,
      password: password,
    }
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function updatePassword(
  api: string | undefined,
  token: string,
  password: string | null
) {
  const response: CallApiReturn = await callApi(
    api,
    'put',
    '/users/updatepassword',
    token,
    {
      password: password,
    }
  );
  return {
    data: response.data,
    success: response.onSuccess,
  };
}

// Dashboard
export async function getUserAreas(
  api: string | undefined,
  token: string,
  userId: number
) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    `/dashboard/userid/${userId}`,
    token
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function getArea(
  api: string | undefined,
  token: string,
  id: string | string[] | undefined
) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    `/dashboard/${id}`,
    token
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function createArea(
  api: string | undefined,
  user: User,
  title: string,
  action: string | undefined,
  reaction: string | undefined,
  args: {action: Argument; reaction: Argument}
) {
  const response: CallApiReturn = await callApi(
    api,
    'post',
    '/dashboard',
    user.token,
    {
      user_id: user.id,
      title: title,
      reaction_id: reaction,
      action_id: action,
      action_arguments: args?.action,
      reaction_arguments: args?.reaction,
    }
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function deleteArea(
  api: string | undefined,
  token: string,
  id: number
) {
  const response: CallApiReturn = await callApi(
    api,
    'delete',
    `/dashboard/${id}`,
    token
  );
  if (response.onSuccess) return response.data;
  else return null;
}
export async function editArea(
  api: string | undefined,
  id: string | string[] | undefined,
  user: User,
  title: string,
  action: string | undefined,
  reaction: string | undefined,
  args: {action: Argument; reaction: Argument}
) {
  const response: CallApiReturn = await callApi(
    api,
    'put',
    `/dashboard/${id}`,
    user.token,
    {
      user_id: user.id,
      title: title,
      reaction_id: reaction,
      action_id: action,
      action_arguments: args?.action,
      reaction_arguments: args?.reaction,
    }
  );
  if (response.onSuccess) return response.data;
  else return null;
}

// Oauth
export async function googleLoginOauth(
  api: string | undefined,
  userToken: string,
  accessToken: string,
  refreshToken: string
) {
  const data = {
    token: accessToken,
    refresh_token: refreshToken,
  };
  const response: CallApiReturn = await callApi(
    api,
    'post',
    '/oauth/google/alreadyLoggedIn',
    userToken,
    data
  );
  return {
    data: response.data,
    success: response.onSuccess,
  };
}
export async function loginOauth(
  api: string | undefined,
  userToken: string | null,
  service: string,
  email: string | null,
  accessToken: string,
  refreshToken: string
) {
  const data: {
    token: string;
    refresh_token: string;
    email: string | null;
  } = {
    token: accessToken,
    refresh_token: refreshToken,
    email: null,
  };
  if (service === 'google') data.email = email;
  else if (service === 'facebook') data.refresh_token = accessToken;

  const response: CallApiReturn = await callApi(
    api,
    'post',
    `/oauth/${service}`,
    userToken,
    data
  );
  return {
    data: response.data,
    success: response.onSuccess,
  };
}
export async function logoutOauth(
  api: string | undefined,
  userToken: string,
  service: string
) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    `/oauth/${service}/logout`,
    userToken
  );
  return response.onSuccess;
}
export async function getOauthList(
  api: string | undefined,
  userId: number,
  userToken: string
) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    `/oauth/userid/${userId}`,
    userToken
  );
  if (response.onSuccess) return response.data;
  else return null;
}

// Reactions
export async function getAllReactions(api: string | undefined, token: string) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    '/reactions/',
    token
  );
  if (response.onSuccess) return response.data;
  else return null;
}

// Services
export async function getAllServices(api: string | undefined, token: string) {
  const response: CallApiReturn = await callApi(
    api,
    'get',
    '/services/',
    token
  );
  if (response.onSuccess) return response.data;
  else return null;
}
