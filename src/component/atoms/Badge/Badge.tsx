import { getStatusStyle } from '~/constants/statusMap';

import { cx } from '~/Utils';

import { useStoreZ } from '~/hooks';

import styles from './Badge.module.css';

type TBadgeStyle = 'light' | 'solid';

interface IBadgeProps {
    statusId: number;
    badgeStyle?: TBadgeStyle;
    className?: string;
}

function Badge({ statusId, badgeStyle = 'light', className }: IBadgeProps) {
    const label = useStoreZ((s) => s.productStates.find((st) => st.id === statusId)?.stateName);

    if (!label) {
        return null;
    }

    const style = getStatusStyle(statusId);
    const variantClass = badgeStyle === 'solid' ? style.solidClass : style.lightClass;

    return <span className={cx(styles.badge, styles[variantClass], className)}>{label}</span>;
}

export default Badge;
