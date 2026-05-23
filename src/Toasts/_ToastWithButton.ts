import { Swal } from '../lib/toast';
import { ESwalIcon } from '../Types/Swal';

import { type IToastGlobal } from './ToastInterface';

const BUTTON_COLORS = {
    CONFIRM: 'red',
    DENY: 'yellow',
    CANCEL: 'green',
};

interface ITostWithButton extends Omit<IToastGlobal, 'typeIcon'> {
    cancelButtonTitle?: string;
    confirmButtonTitle?: string;
    denyButtonTitle?: string;
    isCancelButton?: boolean;
    isCloseButton?: boolean;
    isConfirmButton?: boolean;
    isDenyButton?: boolean;
    isOutsidePress?: boolean;
    typeIcon?: ESwalIcon;
}

const _ToastWithButton = async (props: ITostWithButton) => {
    const {
        cancelButtonTitle = '',
        confirmButtonTitle = '',
        denyButtonTitle = '',
        isCancelButton = false,
        isCloseButton = false,
        isConfirmButton = false,
        isDenyButton = false,
        isOutsidePress = true,
        subContent = '',
        title = '',
        typeIcon = ESwalIcon.ERROR,
    } = props;

    const renderData = {
        // icon: typeIcon,
        titleText: title,
        text: subContent,
        showCloseButton: isCloseButton,
        showCancelButton: isCancelButton,
        showConfirmButton: isConfirmButton,
        showDenyButton: isDenyButton,
        allowOutsideClick: isOutsidePress,
        confirmButtonText: confirmButtonTitle,
        cancelButtonText: cancelButtonTitle,
        denyButtonText: denyButtonTitle,
        confirmButtonColor: BUTTON_COLORS.CONFIRM,
        cancelButtonColor: BUTTON_COLORS.CANCEL,
        denyButtonColor: BUTTON_COLORS.DENY,
        // toast: false,
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
    };

    return await Swal.fire(renderData);
};

export default _ToastWithButton;
