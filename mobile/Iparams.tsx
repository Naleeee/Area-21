/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IparamsNav {
  navigation: any;
  route: {
    params: {
      target: {
        ip: string;
        port: string;
      };
      data: {
        client_id: string;
        token: string;
      };
    };
  };
}

export default interface IparamsService {
  data: {
    client_id: string;
    token: string;
  };
  navigation: any;
  target: {
    ip: string;
    port: string;
  };
}
export default interface Iparams {
  target: {
    ip: string;
    port: string;
  };
  data: {
    client_id: string;
    token: string;
  };
}

export default interface IparamsRoute {
  params: {
    target: {
      ip: string;
      port: string;
    };
    data: {
      client_id: string;
      token: string;
    };
  };
}
