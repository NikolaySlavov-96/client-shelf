import { type FC, memo, type ReactNode } from 'react';

import { cx } from '../../../Utils';

import styles from './_SerifHeading.module.css';

interface ISerifHeadingProps {
    children: ReactNode;
    className?: string;
}

const _SerifHeading: FC<ISerifHeadingProps> = ({ children, className }) => {
    return <h1 className={cx(styles.heading, className)}>{children}</h1>;
};

export default memo(_SerifHeading);
