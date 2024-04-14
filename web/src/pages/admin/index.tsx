import React, {useState} from 'react';
import styles from '@/styles/Admin.module.scss';
import {Button, Input, NavBar} from '@/components';
import {Config} from '@/types';

const Admin = ({config}: {config: Config}) => {
  const [refresh, setRefresh] = useState<Boolean>(false);
  const [url, setUrl] = useState<string | undefined>(config.url);
  const [port, setPort] = useState<string | undefined>(config.port);

  const updateConfig = (
    e: React.FormEvent<HTMLFormElement>,
    url: string | undefined,
    port: string | undefined
  ): void => {
    e.preventDefault();
    const newConfig = config;
    if (url) newConfig.url = url;
    if (port) newConfig.port = port;
    newConfig.api = newConfig.url + ':' + newConfig.port;
    if (config.setter) config.setter(newConfig);

    setRefresh(!refresh);
  };
  return (
    <div id={styles.login}>
      <NavBar />
      <div id={styles.container}>
        <p>Admin</p>
        <form onSubmit={e => updateConfig(e, url, port)}>
          <Input
            id="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            label="URL"
          />
          <Input
            id="port"
            value={port}
            onChange={e => setPort(e.target.value)}
            label="Port"
          />
          <Button type="submit">Update</Button>
        </form>
        <div className={styles.content}>
          <div>
            <p>Next API url:</p>
            <p>{url + ':' + port}</p>
          </div>
          <div>
            <p>Current API url:</p>
            <p>{config.api}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
