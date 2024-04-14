import Link from 'next/link';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | null;
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
  redirectTo?: string;
  disable?: boolean;
}

const Button = ({
  children,
  type = null,
  onClick = null,
  redirectTo = '',
  disable = false,
}: ButtonProps): JSX.Element => {
  if (type) {
    return (
      <button disabled={disable} className={styles.custom} type={type}>
        {children}
      </button>
    );
  } else if (!onClick) {
    return (
      <Link href={redirectTo}>
        <button disabled={disable} className={styles.custom}>
          {children}
        </button>
      </Link>
    );
  } else {
    return (
      <button disabled={disable} className={styles.custom} onClick={onClick}>
        {children}
      </button>
    );
  }
};

export default Button;
