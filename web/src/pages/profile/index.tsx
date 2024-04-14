import styles from '@/styles/Profile.module.scss';
import {Button, Input, NavBar} from '@/components';
import React from 'react';
import {User} from '@/types';

const Profile = ({user}: {user: User}) => {
  return (
    <div id={styles.page}>
      <NavBar />
      <div id={styles.content}>
        <p>Account</p>
        <form>
          <Input id="email" value={user.email} label="Email" disable />
          <Button
            redirectTo="/profile/update-password"
            disable={user.email === 'Connected with OAuth2'}
          >
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
