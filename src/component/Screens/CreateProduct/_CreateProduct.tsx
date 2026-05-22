import { memo, useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '../../atoms';

import { InformationToast } from '../../../Toasts';
import { ESwalIcon } from '../../../Types/Swal';

import { useStoreZ } from '../../../hooks';
import { TEXTS } from '../../../constants';

import styles from './_CreateProduct.module.css';

const _CreateProduct = () => {
  const { addProductWithImage, isProductAdded, isLoadingProductAddition } = useStoreZ();

  const [author, setAuthor] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileName, setFileName] = useState('');

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      setFile(target.files[0]);
    }
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    addProductWithImage({ author, productTitle, genre }, { file, name: fileName });
  }, [author, productTitle, genre, file, fileName, addProductWithImage]);

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
            <div className={`flex-col ${styles.field}`}>
              <label className={styles.field__label} htmlFor="create-author">
                {TEXTS.CREATE_LABEL_AUTHOR}
              </label>
              <input
                id="create-author"
                className={styles.field__input}
                type="text"
                placeholder={TEXTS.CREATE_PLACEHOLDER_AUTHOR}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className={`flex-col ${styles.field}`}>
              <label className={styles.field__label} htmlFor="create-title">
                {TEXTS.CREATE_LABEL_TITLE}
              </label>
              <input
                id="create-title"
                className={styles.field__input}
                type="text"
                placeholder={TEXTS.CREATE_PLACEHOLDER_TITLE}
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                required
              />
            </div>

            <div className={`flex-col ${styles.field}`}>
              <label className={styles.field__label} htmlFor="create-genre">
                {TEXTS.CREATE_LABEL_GENRE}
              </label>
              <input
                id="create-genre"
                className={styles.field__input}
                type="text"
                placeholder={TEXTS.CREATE_PLACEHOLDER_GENRE}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>

            <div className={`flex-col ${styles.field}`}>
              <label className={styles.field__label} htmlFor="create-image">
                {TEXTS.CREATE_LABEL_IMAGE}
              </label>
              <input
                id="create-image"
                className={styles.field__input}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className={`flex-col ${styles.field}`}>
              <label className={styles.field__label} htmlFor="create-src">
                {TEXTS.CREATE_LABEL_SRC}
              </label>
              <input
                id="create-src"
                className={styles.field__input}
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <Button
              label={TEXTS.CREATE_BTN}
              variant="primary"
              size="full"
              type="submit"
              isLoading={isLoadingProductAddition}
              isDisabled={!author || !productTitle || !file}
            />
          </form>
        </div>
    </main>
  );
};

export default memo(_CreateProduct);
