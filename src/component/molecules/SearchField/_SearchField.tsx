import { type FC, memo } from 'react';

import { InputForm } from '~/component/atoms';

import { type IQueryBar } from '~/Types/QueryBar';

import style from './_Search.module.css';

const BUTTON_LABEL = 'Search';

interface ISearchFieldProps {
    // TODO replace any
    onSubmit: (e: any) => void;
    // TODO replace any
    changeHandler: (e: any) => void;
    values: IQueryBar;
}

const _SearchField: FC<ISearchFieldProps> = (props) => {
    const { onSubmit, changeHandler, values } = props;

    return (
        <InputForm buttonLabel={BUTTON_LABEL} formStyles={style['form']} onSubmit={onSubmit}>
            <input
                type="text"
                name="search"
                id="search"
                placeholder={BUTTON_LABEL}
                value={values.search}
                onChange={changeHandler}
                onBlur={changeHandler}
            />
        </InputForm>
    );
};

export default memo(_SearchField);
