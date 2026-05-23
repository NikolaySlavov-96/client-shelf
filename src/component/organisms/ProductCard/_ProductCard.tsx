import { type FC, memo } from 'react';

import { Link } from '../../atoms';

import { ProductDetails } from '../../molecules';

import { ROUT_NAMES } from '~/constants';

import { type TViewType } from '~/Types/Components';
import { type TProductCard } from '~/Types/Product';

import style from './_ProductCard.module.css';

type TProductCardProps = TProductCard & {
    viewType: TViewType;
};

const _ProductCard: FC<TProductCardProps> = (props) => {
    const { productTitle, productId, viewType } = props;

    return (
        <Link to={`${ROUT_NAMES.PRODUCT}/${productId}`} state={{ productTitle }}>
            <article
                className={`shadow ${viewType === 'list' ? 'flex-between' : ''} ${style.container} ${style[`${viewType}__container`]}`}
            >
                <ProductDetails {...props} hasTitle />
            </article>
        </Link>
    );
};

export default memo(_ProductCard);
