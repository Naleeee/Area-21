import styles from '@/styles/Services.module.scss';
import {NavBar, OAuthList} from '@/components';
import React from 'react';
import {Config, User} from '@/types';

const Services = ({
  config,
  user,
}: {
  config: Config;
  user: User;
}): JSX.Element => {
  return (
    <div id={styles.page}>
      <NavBar />
      <div id={styles.content}>
        <p>Available services</p>
        <div id={styles.servicesIcons}>
          <OAuthList config={config} user={user} allServices={true} />
        </div>
      </div>
    </div>
  );
};

export default Services;
