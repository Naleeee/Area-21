import React from 'react';
import styles from './Select.module.scss';
import Select, {components} from 'react-select';
import {Option} from '@/types';

interface CustomSelectProps {
  options: Array<Option>;
  id: string;
  onChange?: (value: any) => void | undefined;
  label: string;
  optionSelected?: Option | null;
}

const CustomSelect = ({
  options,
  id,
  onChange = undefined,
  label = '',
  optionSelected = null,
}: CustomSelectProps) => {
  const customOption = (props: any) => {
    return (
      <components.Option
        {...props}
        className={`${styles.option}  ${
          props.isSelected ? styles.selected : ''
        }`}
      >
        <img src={`/icons/companies/${props.data.service}.png`} />
        <p>{props.data.label}</p>
      </components.Option>
    );
  };
  const customOptionSelected = (props: any) => {
    return (
      <components.Option
        {...props}
        className={`${styles.option} ${styles.absolutePos}`}
      >
        <img src={`/icons/companies/${props.data.service}.png`} />
        <p>{props.data.label}</p>
      </components.Option>
    );
  };

  return (
    <div className={styles.custom}>
      <p>{label}</p>
      <Select
        id={id}
        onChange={onChange}
        className={styles.select}
        options={options}
        defaultValue={optionSelected}
        components={{Option: customOption, SingleValue: customOptionSelected}}
        placeholder={`Select an ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default CustomSelect;
