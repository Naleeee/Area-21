import {Link} from '@/components';
import NextLink from 'next/link';
import {NextRouter, useRouter} from 'next/router';
import styles from './NavBar.module.scss';

const NavBar = (): JSX.Element => {
  const router: NextRouter = useRouter();

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div id={styles.navBar}>
      <img src="/icons/Area21.png" onClick={logout} title={'Logout'} />
      <div id={styles.links}>
        <Link href={'/dashboard'} noStyle={true}>
          Dashboard
        </Link>
        <Link href={'/services'} noStyle={true}>
          Services
        </Link>
        <Link href={'/profile'} noStyle={true}>
          Account
        </Link>
      </div>
      <div id={styles.bar} />
      <NextLink id={styles.newArea} href="/area/new">
        New Area
      </NextLink>
    </div>
  );
};

export default NavBar;
