import styles from './Loading.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = (): JSX.Element => {
  return (
    <div className={styles.loading}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
