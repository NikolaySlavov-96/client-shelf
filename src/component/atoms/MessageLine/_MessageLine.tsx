import { memo } from 'react';

import { convertDateTime } from '~/Helpers';

import { useStoreZ } from '~/hooks';
import { type IMessage, type TMessageStatus } from '~/Store/Slicers/SupportSlicer';

import style from './_MessageLine.module.css';

const STATUS_GLYPH: Record<TMessageStatus, string> = {
    sent: '✓',
    delivered: '✓✓',
    seen: '✓✓',
};

const STATUS_LABEL: Record<TMessageStatus, string> = {
    sent: 'Sent',
    delivered: 'Delivered',
    seen: 'Seen',
};

const _MessageLine = (props: IMessage) => {
    const { message, senderId, createdAt, status } = props;

    const principal = useStoreZ((s) => s.principal);
    const currentTime = convertDateTime(createdAt);

    const isSender = !!senderId && !!principal && senderId === principal;

    if (!senderId) {
        return <p className={style['message__center']}>{message}</p>;
    }

    const effectiveStatus: TMessageStatus = status ?? 'sent';

    return (
        <div className={`${style['container']} ${isSender ? style['message__owner'] : style['message__sender']}`}>
            <div className={style['content__container']}>
                <p className={style['message']}>{message}</p>
                <p>
                    {currentTime}
                    {isSender ? (
                        <span
                            className={`${style['status']} ${style[`status__${effectiveStatus}`] ?? ''}`}
                            aria-label={STATUS_LABEL[effectiveStatus]}
                            title={STATUS_LABEL[effectiveStatus]}
                        >
                            {' '}
                            {STATUS_GLYPH[effectiveStatus]}
                        </span>
                    ) : null}
                </p>
            </div>
        </div>
    );
};

export default memo(_MessageLine);
