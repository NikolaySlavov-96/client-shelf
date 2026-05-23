import { type FC, memo, type MouseEvent, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import style from './_NavigationButton.module.css';

interface INavigationButtonProps {
    path: string;
    title: string;
    isDisabled?: boolean;
    onCustomClick?: () => void;
}

const NavigationButton: FC<INavigationButtonProps> = (props) => {
    const { path, title, isDisabled, onCustomClick } = props;

    const hasCustomClick = useMemo(() => typeof onCustomClick === 'function', [onCustomClick]);

    const handlerClick = useCallback(
        (e: MouseEvent<HTMLAnchorElement>) => {
            if (isDisabled) e.preventDefault();

            if (hasCustomClick && onCustomClick) {
                onCustomClick();
            }

            return e;
        },
        [isDisabled, hasCustomClick, onCustomClick],
    );

    const activePageOnHeader = useCallback(({ isActive }: { isActive: boolean }) => {
        return isActive
            ? {
                  color: 'var(--white)',
                  background: 'var(--accent)',
              }
            : {};
    }, []);

    return (
        <li className={`${style['li']} ${isDisabled ? style['disabled'] : ''}`}>
            {hasCustomClick ? (
                <a onClick={onCustomClick}>{title}</a>
            ) : (
                <NavLink to={path} style={activePageOnHeader} onClick={handlerClick}>
                    {title}
                </NavLink>
            )}
        </li>
    );
};

export default memo(NavigationButton);
