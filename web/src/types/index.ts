type Action = {
  action_id: number;
  arguments: any;
  name: string;
  service_id: number;
};
type ApiResponse = {
  data: any;
  success: Boolean;
};
type ApiUser = {
  email: string;
  token: string;
  user_id: number;
};
type AreaType = {
  action_arguments: any;
  action_id: number;
  area_id: number;
  reaction_arguments: any;
  reaction_id: number;
  title: string;
  user_id: number;
};
type Argument = {
  [key: string]: string;
};
type Config = {
  api: string | undefined;
  url: string | undefined;
  port: string | undefined;
  setter: Function | undefined;
};
type KeyValue = {
  key: string;
  value: any;
};
type Oauth = {
  oauth_token_id: number;
  refresh_token: string;
  service_id: number;
  token: string;
  user_id: number;
};
type Option = {
  value: string | undefined;
  label: string | undefined;
  service: string | undefined;
  arguments: any;
};
type Reaction = {
  arguments: any;
  name: string;
  reaction_id: number;
  service_id: number;
};
type Service = {
  service_id: number;
  name: string;
};
type User = {
  id: number;
  token: string;
  email: string;
};

export type {
  Action,
  ApiResponse,
  ApiUser,
  AreaType,
  Argument,
  Config,
  KeyValue,
  Oauth,
  Option,
  Reaction,
  Service,
  User,
};
