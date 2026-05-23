import { type FC, memo, useCallback, useMemo } from 'react';

import { List } from '../../atoms';

import { type TViewType } from '~/Types/Components';
import { type TProductCard } from '~/Types/Product';
import { ProductCard } from '..';

import styles from './_ListRenderProduct.module.css';

const emptyComponent = () => <h2> There are no items added yet.</h2>;

const keyExtractor = (item: TProductCard) => item?.productId.toString();

interface IListRenderProductProps {
    data: TProductCard[];
    viewType: TViewType;
}

const ListRenderProduct: FC<IListRenderProductProps> = (props) => {
    const { data, viewType } = props;

    const containerStyles = useMemo(() => {
        if (viewType === 'list') {
            return `${styles.item} ${styles[`${viewType}__item`]}`;
        }
        return styles['item'];
    }, [viewType]);

    const renderItem = useCallback(
        ({ item }: { item: TProductCard }) => {
            return <ProductCard {...item} viewType={viewType} />;
        },
        [viewType],
    );

    return (
        <List
            data={data}
            EmptyComponent={emptyComponent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={containerStyles}
        />
    );
};

export default memo(ListRenderProduct);
