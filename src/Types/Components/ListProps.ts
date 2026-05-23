import type { HTMLAttributes } from 'react';

export interface IListProps<ItemT> extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
    data: ItemT[];
    renderItem: ({ item, index }: { item: ItemT; index: number }) => JSX.Element | null;
    keyExtractor: (item: ItemT, index: number) => string;
    style?: string;
    EmptyComponent?: () => JSX.Element | null;
}
