export interface IListProps<ItemT> {
    data: ItemT[];
    renderItem: ({ item, index }: { item: ItemT; index: number }) => JSX.Element | null;
    keyExtractor: (item: ItemT, index: number) => string;
    style?: string;
    EmptyComponent?: () => JSX.Element | null;
}
