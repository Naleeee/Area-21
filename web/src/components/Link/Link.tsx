import styles from './Link.module.scss';
import Link from 'next/link';

interface CustomLinkProps {
  children: React.ReactNode;
  href: string;
  noStyle?: boolean;
  disabled?: boolean;
}

const CustomLink = ({
  children,
  href,
  noStyle = false,
  disabled = false,
}: CustomLinkProps): JSX.Element => {
  if (disabled && noStyle) {
    return <p className={`${styles.basic} ${styles.disabled}`}>{children}</p>;
  } else if (disabled) {
    return <p className={`${styles.link} ${styles.disabled}`}>{children}</p>;
  } else if (noStyle) {
    return (
      <Link className={styles.basic} href={href}>
        {children}
      </Link>
    );
  } else {
    return (
      <Link className={styles.link} href={href}>
        {children}
      </Link>
    );
  }
};

export default CustomLink;
