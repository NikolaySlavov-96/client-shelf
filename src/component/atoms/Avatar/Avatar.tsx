import { cx } from '~/Utils';

import styles from './Avatar.module.css';

type TAvatarSize = 'sm' | 'lg';

interface IAvatarProps {
    initials: string;
    src?: string;
    size?: TAvatarSize;
    className?: string;
}

function Avatar({ initials, src, size = 'sm', className }: IAvatarProps) {
    return (
        <div
            className={cx('flex-center', styles.avatar, styles[`avatar--${size}`], className)}
            aria-label={initials}
            role="img"
        >
            {src ? (
                <img
                    src={src}
                    alt={initials}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                />
            ) : (
                initials
            )}
        </div>
    );
}

export default Avatar;
