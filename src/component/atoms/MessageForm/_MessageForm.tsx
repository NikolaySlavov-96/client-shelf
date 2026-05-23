import { memo, useCallback } from 'react';

import { ESendEvents } from '~/constants';

import { useForm } from '~/hooks';
import { SocketService } from '~/services';
import { InputForm } from '..';

const DEFAUlT_BUTTON_LABEL = 'Send';

const MessageForm = (props: any) => {
    const { buttonLabel = DEFAUlT_BUTTON_LABEL, roomName, connectId } = props;

    const sendMessage = useCallback(
        (data: { message: string }) => {
            SocketService.sendData(ESendEvents.SUPPORT_MESSAGE, {
                roomName,
                message: data.message,
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
            // add debounce from 2 second before send event again
            SocketService.sendData(ESendEvents.SUPPORT_ACTIVITY, { roomName, connectId });
        },
        [changeHandler, connectId, roomName],
    );

    return (
        <InputForm
            buttonLabel={buttonLabel}
            // formStyles={containerStyles // style['send__input-button']}
            onSubmit={onSubmit}
        >
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
