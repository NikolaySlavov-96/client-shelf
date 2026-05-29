import { useState } from 'react';

import { TEXTS } from '~/constants';

type TData = { [key: string]: string };
type TError = { [key: string]: [string, number?] };

// TODO(lint): type `onSubmitHandler` data parameter as TData (no-explicit-any).
const useForm = (
    initialValue: TData,
    onSubmitHandler: (data: any) => void,
    errorTarget: TError,
    clearState: boolean = true,
) => {
    const [values, setValue] = useState(initialValue);
    const [errors, setErrors] = useState(initialValue);

    // TODO(lint): type `e` as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> (no-explicit-any).
    const changeHandler = (e: any) => {
        setValue((state) => ({ ...state, [e.target.name]: e.target.value }));

        if (errorTarget[e.target.name] && errorTarget[e.target.name][0] === 'required') {
            if (values[e.target.name].length <= 1) {
                setErrors((state) => ({ ...state, [e.target.name]: `${e.target.name} ${TEXTS.VALIDATION_REQUIRED}` }));
            } else if ((errorTarget[e.target.name][1] ?? 0) > values[e.target.name].length) {
                setErrors((state) => ({
                    ...state,
                    [e.target.name]: `${TEXTS.VALIDATION_MIN_LENGTH} ${errorTarget[e.target.name][1]}`,
                }));
            } else {
                setErrors((state) => ({ ...state, [e.target.name]: '' }));
            }
        }
    };

    // TODO(lint): type `e` as React.FormEvent<HTMLFormElement> (no-explicit-any).
    const onSubmit = (e: any) => {
        e.preventDefault();

        onSubmitHandler(values);
        if (clearState) {
            setValue(initialValue);
        }
    };

    // TODO(lint): type `newValue` as TData (no-explicit-any).
    const changeValue = (newValue: any) => {
        setValue(newValue);
    };

    return {
        values,
        changeHandler,
        onSubmit,
        changeValue,
        errors,
    };
};

export default useForm;
