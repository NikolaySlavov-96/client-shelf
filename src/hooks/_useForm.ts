import { useState } from 'react';

type TData = { [key: string]: string };
type TError = { [key: string]: [string, number?] };

const useForm = (
    initialValue: TData,
    onSubmitHandler: (data: any) => void,
    errorTarget: TError,
    clearState: boolean = true,
) => {
    const [values, setValue] = useState(initialValue);
    const [errors, setErrors] = useState(initialValue);

    const changeHandler = (e: any) => {
        setValue((state) => ({ ...state, [e.target.name]: e.target.value }));

        if (errorTarget[e.target.name] && errorTarget[e.target.name][0] === 'required') {
            if (values[e.target.name].length <= 1) {
                setErrors((state) => ({ ...state, [e.target.name]: `${e.target.name} is required` }));
            } else if ((errorTarget[e.target.name][1] ?? 0) > values[e.target.name].length) {
                setErrors((state) => ({
                    ...state,
                    [e.target.name]: `Minimal length is ${errorTarget[e.target.name][1]}`,
                }));
            } else {
                setErrors((state) => ({ ...state, [e.target.name]: '' }));
            }
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        onSubmitHandler(values);
        if (clearState) {
            setValue(initialValue);
        }
    };

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
