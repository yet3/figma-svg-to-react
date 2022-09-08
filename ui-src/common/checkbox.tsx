import clsx from 'clsx';
import { ChangeEvent } from 'react';

interface Props {
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

const Checkbox = ({ label, value, onChange, disabled }: Props) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.checked);
  };

  return (
    <label className={clsx('checkbox-label', disabled && 'checkbox-label-disabled')}>
      <input disabled={disabled} type="checkbox" checked={value ?? false} onChange={handleOnChange} className={clsx('checkbox')} />
      {label}
    </label>
  );
};

export { Checkbox };
