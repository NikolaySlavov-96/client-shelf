import { memo, useEffect } from 'react';

import { Link } from '~/component/atoms';

import { ROUT_NAMES, TEXTS } from '~/constants';

import { useStoreZ } from '~/hooks';

import style from './_NewProductModal.module.css';

const NewProductModal = () => {
    const { content, isVisible, closeModal } = useStoreZ();

    useEffect(() => {
        const timer = setTimeout(() => {
            closeModal();
        }, 5000);

        return () => clearTimeout(timer);
    }, [closeModal]);

    if (!isVisible) {
        return null;
    }

    const lastProduct = content.length - 1;

    const currentProductData = content[lastProduct];

    return (
        <Link
            to={`${ROUT_NAMES.PRODUCT}/${currentProductData?.id}`}
            className={`shadow ${style['container']} ${!isVisible ? '' : style['visible']}`}
        >
            <h3>{TEXTS.NEW_PRODUCT_HEADING}</h3>
            <div>
                <h1>{currentProductData?.productTitle}</h1>
            </div>
            <p>{TEXTS.NEW_PRODUCT_HINT}</p>
        </Link>
    );
};

export default memo(NewProductModal);
