import { type FC, memo } from 'react';

import style from './_IconActionButton.module.css';

interface IIconActionButtonModuleProps {
    onClick: () => void;
    iconName?: string;
}

const _IconActionButtonModule: FC<IIconActionButtonModuleProps> = (props) => {
    const { onClick, iconName = 'fas fa-chevron-circle-left' } = props;

    return (
        <div className={style['container']}>
            <button className={style['btn']} onClick={onClick}>
                <i className={iconName} />
            </button>
        </div>
    );
};

export default memo(_IconActionButtonModule);
