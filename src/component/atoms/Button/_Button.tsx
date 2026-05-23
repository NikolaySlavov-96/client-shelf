import { type ButtonHTMLAttributes, type FC, memo, type ReactNode } from 'react';

import { cx } from '~/Utils';

import styles from './Button.module.css';

type TButtonVariant = 'primary' | 'ghost' | 'outline' | 'text';
type TButtonSize = 'sm' | 'md' | 'full';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    children?: ReactNode;
    variant?: TButtonVariant;
    size?: TButtonSize;
    isLoading?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
}

const _Button: FC<IButtonProps> = (props) => {
    const {
        label,
        children,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        isDisabled = false,
        type = 'button',
        className,
        disabled,
        ariaLabel,
        ...rest
    } = props;

    const classes = cx(styles.btn, styles[`btn--${variant}`], styles[`btn--${size}`], className);

    return (
        <button
            type={type}
            className={classes}
            disabled={isDisabled || isLoading || disabled}
            aria-disabled={isDisabled || isLoading || disabled}
            aria-label={ariaLabel}
            {...rest}
        >
            {isLoading ? '...' : (children ?? label)}
        </button>
    );
};

export default memo(_Button);
