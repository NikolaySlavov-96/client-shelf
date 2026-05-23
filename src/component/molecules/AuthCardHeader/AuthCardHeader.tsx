import { type FC, memo } from 'react';

import styles from './AuthCardHeader.module.css';

interface IAuthCardHeaderProps {
    title: string;
    subtitle: string;
}

const AuthCardHeader: FC<IAuthCardHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className={styles.head}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    );
};

export default memo(AuthCardHeader);
