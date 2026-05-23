interface IFormatSelectOptions {
    value: string;
    label: string;
}

const _FormatSelectOptions = (data: any[], { value, label }: IFormatSelectOptions) => {
    const newStates = data.map((s) => {
        return { value: s[value], label: s[label] };
    });

    return newStates;
};

export default _FormatSelectOptions;
