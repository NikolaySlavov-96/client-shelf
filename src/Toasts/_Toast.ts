import { Swal } from '../lib/toast';
import { ESwalIcon } from '../Types/Swal';

import { type IToastGlobal } from './ToastInterface';

type TToast = 'top-end';

interface IToast extends IToastGlobal {
    position?: TToast;
}

const _Toast = (props: IToast) => {
    const { typeIcon = ESwalIcon.ERROR, position = 'top-end', title = '', subContent = '' } = props;

    const Toast = Swal.mixin({
        toast: true,
        position,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    const renderContent = {
        icon: typeIcon,
        title,
        text: subContent,
    };

    Toast.fire(renderContent);
};

export default _Toast;
