import { type FC, memo, type ReactNode } from 'react';

import { SerifHeading } from '~/component/atoms';

import styles from './StatusCard.module.css';

interface IStatusCardProps {
    title: string;
    action?: ReactNode;
}

const StatusCard: FC<IStatusCardProps> = ({ title, action }) => {
    return (
        <main className={`flex-center ${styles.main}`}>
            <div className={styles.card}>
                <SerifHeading>{title}</SerifHeading>
                {action}
            </div>
        </main>
    );
};

export default memo(StatusCard);
