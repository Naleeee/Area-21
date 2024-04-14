import {Loading} from '..';
import styles from './LoadingPage.module.scss';

const LoadingPage = (): JSX.Element => {
  return (
    <div id={styles.loadingPage}>
      <Loading />
    </div>
  );
};

export default LoadingPage;
