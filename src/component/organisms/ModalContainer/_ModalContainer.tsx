import { type ComponentType, memo } from 'react';

// TODO: Nikolay
import NewProductModal from '../../molecules/Modals/NewProductModal/_NewProductModal';
import SearchModal from '../../molecules/SearchModal/SearchModal';

import { MODAL_NAMES } from '../../../constants';

import { useStoreZ } from '../../../hooks';

const components: Record<string, ComponentType> = {
    [MODAL_NAMES.NEW_PRODUCT]: NewProductModal,
    [MODAL_NAMES.SEARCH]: SearchModal,
};

const ModalContainer = () => {
    const { modalName } = useStoreZ();

    if (!modalName) {
        return null;
    }

    const RenderModal = components[modalName];
    if (!RenderModal) {
        return null;
    }

    return <RenderModal />;
};

export default memo(ModalContainer);
