import { TEXTS } from '~/constants';

export type TCreateProductTextField = 'author' | 'productTitle' | 'genre' | 'fileName';

interface ICreateProductTextFieldConfig {
    kind: 'text';
    id: string;
    key: TCreateProductTextField;
    label: string;
    placeholder?: string;
    required?: boolean;
}

interface ICreateProductFileFieldConfig {
    kind: 'file';
    id: string;
    label: string;
    accept: string;
}

export type TCreateProductFieldConfig = ICreateProductTextFieldConfig | ICreateProductFileFieldConfig;

export const CREATE_PRODUCT_FIELDS: TCreateProductFieldConfig[] = [
    {
        kind: 'text',
        id: 'create-author',
        key: 'author',
        label: TEXTS.CREATE_LABEL_AUTHOR,
        placeholder: TEXTS.CREATE_PLACEHOLDER_AUTHOR,
        required: true,
    },
    {
        kind: 'text',
        id: 'create-title',
        key: 'productTitle',
        label: TEXTS.CREATE_LABEL_TITLE,
        placeholder: TEXTS.CREATE_PLACEHOLDER_TITLE,
        required: true,
    },
    {
        kind: 'text',
        id: 'create-genre',
        key: 'genre',
        label: TEXTS.CREATE_LABEL_GENRE,
        placeholder: TEXTS.CREATE_PLACEHOLDER_GENRE,
    },
    {
        kind: 'file',
        id: 'create-image',
        label: TEXTS.CREATE_LABEL_IMAGE,
        accept: 'image/*',
    },
    {
        kind: 'text',
        id: 'create-src',
        key: 'fileName',
        label: TEXTS.CREATE_LABEL_SRC,
    },
];

export const CREATE_PRODUCT_INITIAL_VALUES: Record<TCreateProductTextField, string> = {
    author: '',
    productTitle: '',
    genre: '',
    fileName: '',
};
