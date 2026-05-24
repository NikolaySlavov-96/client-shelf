import { TEXTS } from '~/constants';

export type TCreateProductTextField = 'productTitle' | 'genre' | 'fileName';

interface ICreateProductTextFieldConfig {
    kind: 'text';
    id: string;
    key: TCreateProductTextField;
    label: string;
    placeholder?: string;
    required?: boolean;
}

interface ICreateProductChipsFieldConfig {
    kind: 'chips';
    id: string;
    key: 'authors';
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

export type TCreateProductFieldConfig =
    | ICreateProductTextFieldConfig
    | ICreateProductChipsFieldConfig
    | ICreateProductFileFieldConfig;

export interface ICreateProductValues {
    authors: string[];
    productTitle: string;
    genre: string;
    fileName: string;
}

export const CREATE_PRODUCT_FIELDS: TCreateProductFieldConfig[] = [
    {
        kind: 'chips',
        id: 'create-authors',
        key: 'authors',
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

export const CREATE_PRODUCT_INITIAL_VALUES: ICreateProductValues = {
    authors: [],
    productTitle: '',
    genre: '',
    fileName: '',
};
