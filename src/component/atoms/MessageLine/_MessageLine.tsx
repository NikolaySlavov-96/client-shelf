import { memo } from 'react';

import { convertDateTime } from '~/Helpers';

import { useStoreZ } from '~/hooks';
import { type IMessage } from '~/Store/Slicers/SupportSlicer';

import style from './_MessageLine.module.css';

const _MessageLine = (props: IMessage) => {
    const { message, senderId, createdAt } = props;

    const principal = useStoreZ((s) => s.principal);
    const currentTime = convertDateTime(createdAt);

    const isSender = !!senderId && !!principal && senderId === principal;

    if (!senderId) {
        return <p className={style['message__center']}>{message}</p>;
    }

    return (
        <div className={`${style['container']} ${isSender ? style['message__owner'] : style['message__sender']}`}>
            <div className={style['content__container']}>
                <p className={style['message']}>{message}</p>
                <p>{currentTime}</p>
            </div>
        </div>
    );
};

export default memo(_MessageLine);
