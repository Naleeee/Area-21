import styles from './Component.module.scss';

const Component = ({content}: {content: string}) => {
  return <div className={styles.component}>{content}</div>;
};

export default Component;
