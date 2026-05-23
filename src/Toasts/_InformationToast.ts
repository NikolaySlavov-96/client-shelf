import { Swal } from '../lib/toast';
import { ESwalIcon } from '../Types/Swal';

import { type IToastGlobal } from './ToastInterface';

const _InformationToast = (props: IToastGlobal) => {
    const { typeIcon = ESwalIcon.ERROR, title = '', subContent = '' } = props;

    const renderContent = {
        title,
        icon: typeIcon,
        text: subContent,
    };

    Swal.fire(renderContent);
};

export default _InformationToast;
