import { type FC, memo, useCallback } from 'react';

import { Button } from '../../atoms';

import style from './_Pagination.module.css';

interface IPaginationButtonProps {
    onSubmit: () => void;
    content: number | string;
}

const PaginationButton: FC<IPaginationButtonProps> = (props) => {
    const { onSubmit, content } = props;

    return (
        <Button variant="outline" size="sm" className={style['page']} onClick={onSubmit}>
            {content}
        </Button>
    );
};

interface IPaginationProps {
    count: number;
    onSubmit: (page: number) => void;
    page: number;
}

const Pagination: FC<IPaginationProps> = (props) => {
    const { count, page, onSubmit } = props;

    const onPressArrowBack = useCallback(() => {
        if (page - 1 > 0) onSubmit(page - 1);
    }, [onSubmit, page]);

    const onPressArrowNext = useCallback(() => {
        const hasNextPage = count >= page + 1;

        return hasNextPage ? onSubmit(page + 1) : () => {};
    }, [count, page, onSubmit]);

    const twoPagesBefore = page - 2;
    const onePageBefore = page - 1;
    const onePageAhead = page + 1;
    const twoPagesAhead = page + 2;

    return (
        <div className={`flex-center ${style['container']}`}>
            <PaginationButton content="&#x3c;" onSubmit={onPressArrowBack} />
            {twoPagesBefore > 0 && (
                <PaginationButton content={twoPagesBefore} onSubmit={() => onSubmit(twoPagesBefore)} />
            )}
            {onePageBefore > 0 && <PaginationButton content={onePageBefore} onSubmit={() => onSubmit(onePageBefore)} />}
            <p className={`${style['current__page']} ${style['page']} ${style['pageSize']}`}>{page}</p>
            {count >= onePageAhead && (
                <PaginationButton content={onePageAhead} onSubmit={() => onSubmit(onePageAhead)} />
            )}
            {count >= twoPagesAhead && (
                <PaginationButton content={twoPagesAhead} onSubmit={() => onSubmit(twoPagesAhead)} />
            )}
            <PaginationButton content="&#x3e;" onSubmit={onPressArrowNext} />
        </div>
    );
};

export default memo(Pagination);
