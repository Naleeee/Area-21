import styles from './Input.module.scss';

interface InputProps {
  id: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  label?: string;
  type?: string;
  tabLeft?: boolean;
  value?: string;
  disable?: boolean;
}

const Input = ({
  id,
  onChange = undefined,
  label = '',
  type = 'text',
  tabLeft = false,
  value = '',
  disable = false,
}: InputProps): JSX.Element => {
  const style1: string = tabLeft ? styles.tabLeft : '';
  const style2: string = disable ? styles.disable : '';
  return (
    <div className={`${styles.container} ${style1} ${style2}`}>
      <label>{label}</label>
      <div>
        {tabLeft && <p>•</p>}
        <input
          disabled={disable}
          value={value}
          onChange={onChange}
          type={type}
          id={id}
        />
      </div>
    </div>
  );
};

export default Input;
