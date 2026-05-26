import { memo, useCallback, useRef } from 'react';

import { ESendEvents } from '~/constants';

import { useForm } from '~/hooks';
import { SocketService } from '~/services';
import { InputForm } from '..';

const DEFAUlT_BUTTON_LABEL = 'Send';
const ACTIVITY_DEBOUNCE_MS = 2000;

const MessageForm = (props: any) => {
    const { buttonLabel = DEFAUlT_BUTTON_LABEL, roomName } = props;

    const lastActivitySentAt = useRef(0);

    const sendMessage = useCallback(
        (data: { message: string }) => {
            const trimmed = (data.message ?? '').trim();
            if (!trimmed) return;
            SocketService.sendData(ESendEvents.SUPPORT_MESSAGE, {
                roomName,
                message: trimmed,
            });
        },
        [roomName],
    );

    const { values, changeHandler, onSubmit } = useForm(
        {
            message: '',
        },
        sendMessage,
        {
            message: ['required', 1],
        },
    );

    const activityHandler = useCallback(
        (e: any) => {
            changeHandler(e);
            const now = Date.now();
            if (now - lastActivitySentAt.current > ACTIVITY_DEBOUNCE_MS) {
                lastActivitySentAt.current = now;
                SocketService.sendData(ESendEvents.SUPPORT_ACTIVITY, { roomName });
            }
        },
        [changeHandler, roomName],
    );

    return (
        <InputForm buttonLabel={buttonLabel} onSubmit={onSubmit}>
            <input
                type="text"
                name="message"
                id="message"
                placeholder={DEFAUlT_BUTTON_LABEL}
                value={values.message}
                onChange={activityHandler}
                onBlur={activityHandler}
            />
        </InputForm>
    );
};

export default memo(MessageForm);
