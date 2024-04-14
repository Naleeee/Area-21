import styles from '@/styles/UpdatePassword.module.scss';
import {Button, Input, NavBar} from '@/components';
import React, {useState, FormEventHandler} from 'react';
import {updatePassword} from '@/scripts/Utils';
import Router from 'next/router';
import {ApiResponse, Config, User} from '@/types';

const UpdatePassword = ({config, user}: {config: Config; user: User}) => {
  const [errorRequestContent, setErrorRequestContent] = useState<string>('');
  const [errorRequest, setErrorRequest] = useState<Boolean>(false);
  const [errorMatch, setErrorMatch] = useState<Boolean>(false);
  const [password1, setPassword1] = useState<string | null>(null);
  const [password2, setPassword2] = useState<string | null>(null);

  const handlePassword1 = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorRequest(false);
    setErrorMatch(false);
    setPassword1(e.target.value);
  };
  const handlePassword2 = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorRequest(false);
    setErrorMatch(false);
    setPassword2(e.target.value);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrorRequest(false);
    if (password1 != password2) {
      setErrorMatch(true);
      return;
    }
    const response: ApiResponse = await updatePassword(
      config.api,
      user.token,
      password1
    );
    if (response.success) {
      Router.push('/profile');
    } else {
      setErrorRequest(true);
      setErrorRequestContent(response.data);
    }
  };

  return (
    <div id={styles.page}>
      <NavBar />
      <div id={styles.content}>
        <p>Change Password</p>
        <form onSubmit={handleSubmit}>
          <Input
            id="password1"
            type="password"
            value={password1 ? password1 : ''}
            onChange={handlePassword1}
            label="New password"
          />
          <Input
            id="password2"
            type="password"
            value={password2 ? password2 : ''}
            onChange={handlePassword2}
            label="Confirm Password"
          />
          <Button
            disable={
              !password1 ||
              password1.length == 0 ||
              !password2 ||
              password2.length == 0
            }
            type="submit"
          >
            Update
          </Button>
          {errorMatch && <p className={styles.error}>Passwords don't match.</p>}
          {errorRequest && (
            <p className={styles.error}>{errorRequestContent}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
