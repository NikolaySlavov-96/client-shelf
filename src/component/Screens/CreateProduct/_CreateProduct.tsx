import { type ChangeEvent, type FormEvent, memo, useCallback, useEffect, useState } from 'react';

import { Button } from '~/component/atoms';

import { TEXTS } from '~/constants';

import { useStoreZ } from '~/hooks';
import { InformationToast } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

import {
    CREATE_PRODUCT_FIELDS,
    CREATE_PRODUCT_INITIAL_VALUES,
    type TCreateProductTextField,
} from './_CreateProduct.config';
import styles from './_CreateProduct.module.css';

const CreateProduct = () => {
    const { addProductWithImage, isProductAdded, isLoadingProductAddition } = useStoreZ();

    const [values, setValues] = useState(CREATE_PRODUCT_INITIAL_VALUES);
    const [file, setFile] = useState<File | undefined>(undefined);

    const handleTextChange = useCallback((key: TCreateProductTextField, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        if (target.files && target.files[0]) {
            setFile(target.files[0]);
        }
    }, []);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!file) return;
            const { author, productTitle, genre, fileName } = values;
            addProductWithImage({ author, productTitle, genre }, { file, name: fileName });
        },
        [values, file, addProductWithImage],
    );

    useEffect(() => {
        if (!isLoadingProductAddition) {
            if (!isProductAdded) {
                InformationToast({ title: TEXTS.TOAST_GENERIC_ERROR, typeIcon: ESwalIcon.ERROR });
                return;
            }
            InformationToast({ title: TEXTS.TOAST_IMAGE_SUCCESS, typeIcon: ESwalIcon.SUCCESS });
        }
    }, [isLoadingProductAddition, isProductAdded]);

    return (
        <main className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.header__title}>{TEXTS.CREATE_TITLE}</h1>
            </header>

            <div className={styles.card}>
                <form className={`flex-col ${styles.form}`} onSubmit={handleSubmit} noValidate>
                    {CREATE_PRODUCT_FIELDS.map((field) => (
                        <div className={`flex-col ${styles.field}`} key={field.id}>
                            <label className={styles.field__label} htmlFor={field.id}>
                                {field.label}
                            </label>
                            {field.kind === 'text' ? (
                                <input
                                    id={field.id}
                                    className={styles.field__input}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={values[field.key]}
                                    onChange={(e) => handleTextChange(field.key, e.target.value)}
                                    required={field.required}
                                />
                            ) : (
                                <input
                                    id={field.id}
                                    className={styles.field__input}
                                    type="file"
                                    accept={field.accept}
                                    onChange={handleFileChange}
                                />
                            )}
                        </div>
                    ))}

                    <Button
                        label={TEXTS.CREATE_BTN}
                        variant="primary"
                        size="full"
                        type="submit"
                        isLoading={isLoadingProductAddition}
                        isDisabled={!values.author || !values.productTitle || !file}
                    />
                </form>
            </div>
        </main>
    );
};

export default memo(CreateProduct);
