import { cx } from '~/Utils';

import styles from './Stat.module.css';

interface IStatProps {
    value: number | string;
    label: string;
    className?: string;
}

function Stat({ value, label, className }: IStatProps) {
    return (
        <div className={cx(styles.stat, className)}>
            <span className={styles.stat__n}>{value}</span>
            <span className={styles.stat__l}>{label}</span>
        </div>
    );
}

export default Stat;
