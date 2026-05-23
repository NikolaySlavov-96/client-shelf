import { type ChangeEvent, type FC, type InputHTMLAttributes, memo } from 'react';

import styles from './_FormField.module.css';

interface IFormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const _FormField: FC<IFormFieldProps> = ({ id, label, value, onChange, ...rest }) => {
    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <input id={id} className={styles.input} value={value} onChange={onChange} {...rest} />
        </div>
    );
};

export default memo(_FormField);
