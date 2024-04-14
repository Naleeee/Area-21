import styles from '@/styles/Register.module.scss';
import {Button, Input, Link} from '@/components';
import {useState, FormEventHandler} from 'react';
import Router from 'next/router';
import {registerUser} from '@/scripts/Utils';
import {ApiUser, Config} from '@/types';

const Register = ({config}: {config: Config}) => {
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isEmail = (value: string): Boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };
  const isError = (): Boolean => {
    let message = '';
    if (password1 != password2) message = 'Passwords mismatches.';
    else if (
      email.length == 0 ||
      password1.length == 0 ||
      password2.length == 0
    )
      message = 'One or more field missing.';
    else if (!isEmail(email)) message = 'Invalid email.';

    if (message.length > 0) {
      setErrorMessage(message);
      setError(true);
      return true;
    }
    return false;
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(false);
    setEmail(e.target.value);
  };
  const handlePassword1 = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(false);
    setPassword1(e.target.value);
  };
  const handlePassword2 = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(false);
    setPassword2(e.target.value);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (isError()) return;

    const response: ApiUser = await registerUser(config.api, email, password1);
    if (response) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: response.email,
          id: response.user_id,
          token: response.token,
        })
      );
      Router.push('/dashboard');
    } else {
      setErrorMessage('An account with this email already exists.');
      setError(true);
    }
  };

  return (
    <div id={styles.register}>
      <div id={styles.backgroundRectangle}>
        <p id={styles.title}>Sign up</p>
        <form onSubmit={handleSubmit}>
          <Input
            id={email}
            value={email}
            onChange={handleEmail}
            label="Email"
          />
          <Input
            id={password1}
            value={password1}
            onChange={handlePassword1}
            label="Password"
            type="password"
          />
          <Input
            id={password2}
            value={password2}
            onChange={handlePassword2}
            label="Password Confirmation"
            type="password"
          />
          {error && <p className={styles.errorRegister}>{errorMessage}</p>}
          <Button type={'submit'}>Register</Button>
          <div id={styles.login}>
            <p>You already have an account ?</p>
            <Link href="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
