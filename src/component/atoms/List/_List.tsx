import { Fragment, useCallback } from 'react';

import { type IListProps } from '~/Types/Components';

const List = <ItemT,>(props: IListProps<ItemT>) => {
    const { data, renderItem, keyExtractor, EmptyComponent, style, ...rest } = props;

    const _renderItem = useCallback(
        // TODO(lint): type `item` as ItemT (no-explicit-any).
        (item: any, index: number) => (
            <Fragment key={keyExtractor(item, index)}>
                {renderItem({
                    item,
                    index,
                })}
            </Fragment>
        ),
        [keyExtractor, renderItem],
    );

    return (
        <div className={style} {...rest}>
            {data.length === 0 ? EmptyComponent && <EmptyComponent /> : data.map(_renderItem)}
        </div>
    );
};

// With "memo" i have the problem at use on component
export default List;
