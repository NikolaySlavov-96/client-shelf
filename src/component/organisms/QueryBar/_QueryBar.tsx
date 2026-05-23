import { type Dispatch, type FC, memo, type SetStateAction, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { LayoutIcon, SearchField, Select } from '~/component/molecules';

import { SEARCH_NAME } from '~/constants';

import { useForm, useStoreZ } from '~/hooks';
import { type TViewType } from '~/Types/Components';
import { type IQueryBar } from '~/Types/QueryBar';
import { type TOptionType } from '~/Types/Select';

import style from './_QueryBar.module.css';

// TODO Moving
const pageSizeOptions = [
    {
        label: '12',
        value: '12',
    },
    {
        label: '24',
        value: '24',
    },
    {
        label: '36',
        value: '36',
    },
    {
        label: '72',
        value: '72',
    },
];

interface IQueryBarProps {
    hasLeftSelector: boolean;
    onPressSearch: ({ search }: IQueryBar) => void;
    leftSelectData?: number;
    leftSelectorData?: TOptionType[];
    onPressLeftSelector?: Dispatch<SetStateAction<number>>;
    viewType?: TViewType;
    onPressViewType?: (viewTypeParam: TViewType) => void;
}

const QueryBar: FC<IQueryBarProps> = (props) => {
    const {
        leftSelectorData,
        hasLeftSelector,
        leftSelectData,
        onPressLeftSelector,
        onPressSearch,
        viewType,
        onPressViewType,
    } = props;

    const [searchParams, setSearchParams] = useSearchParams();

    const { setPageLimit } = useStoreZ();

    const { values, changeHandler, onSubmit } = useForm(
        {
            search: '',
        },
        onPressSearch,
        {
            search: ['required', 2],
        },
        false,
    );

    const currentLimitParam = searchParams.get(SEARCH_NAME.LIMIT);

    const pageLimit = useCallback(
        (e: TOptionType) => {
            const pageSize = e.value;
            setPageLimit(Number(pageSize));
            setSearchParams((prev) => ({ ...prev, limit: pageSize }));
        },
        [setPageLimit, setSearchParams],
    );

    const changeState = useCallback(
        (e: TOptionType) => {
            const state = Number(e.value);
            if (onPressLeftSelector) onPressLeftSelector(state);
        },
        [onPressLeftSelector],
    );

    return (
        <div className={`flex-between ${style['container']}`}>
            {hasLeftSelector ? (
                <Select
                    options={leftSelectorData || []}
                    placeHolder={leftSelectorData && leftSelectData ? leftSelectorData[leftSelectData - 1].label : ''}
                    onChange={changeState}
                    size={'240'}
                />
            ) : (
                <div />
            )}

            <SearchField values={values as unknown as IQueryBar} changeHandler={changeHandler} onSubmit={onSubmit} />

            <div className={`flex-align ${style['right__container']}`}>
                {onPressViewType && viewType ? <LayoutIcon typeView={viewType} onChange={onPressViewType} /> : null}

                <Select
                    options={pageSizeOptions}
                    placeHolder={currentLimitParam || ''}
                    onChange={pageLimit}
                    size={'70'}
                />
            </div>
        </div>
    );
};

export default memo(QueryBar);
