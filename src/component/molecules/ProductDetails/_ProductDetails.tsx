import { type FC, memo } from 'react';

import { type TProductCard } from '../../../Types/Product';

import style from './_ProductDetails.module.css';

type TProductDetails = TProductCard & {
    hasTitle?: boolean;
};

const _ProductDetails: FC<TProductDetails> = (props) => {
    const { authorName, productType, fileUrl, fileSrc, hasTitle, productTitle } = props;

    return (
        <>
            <div className={style['image__container']}>
                <img src={fileUrl} alt={fileSrc} />
            </div>

            {hasTitle ? <h1 className={style['product_title']}>{productTitle}</h1> : ''}

            <div>
                {!hasTitle ? (
                    <p>
                        Title: <span>{productTitle}</span>
                    </p>
                ) : null}
                <p>
                    Author: <span>{authorName}</span>
                </p>
                <p>
                    Genre: <span>{productType}</span>
                </p>
            </div>
        </>
    );
};

export default memo(_ProductDetails);
