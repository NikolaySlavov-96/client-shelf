import { type FC, memo } from 'react';

import { ViewElement } from '../../atoms';

import { type IProductSkeleton } from '../Types/Product';

import style from './_ListProductCardSkeleton.module.css';

const DEFAULT_HEIGHT = 20;

const _ListProductCardSkeleton: FC<IProductSkeleton> = (props) => {
    const { hasTitle = true } = props;

    return (
        <div className={`shadow flex-between ${style['container']}`}>
            <ViewElement width={200} height={100} />

            {hasTitle ? <ViewElement width={180} height={DEFAULT_HEIGHT} /> : null}

            <ViewElement width={220} height={DEFAULT_HEIGHT} />

            <ViewElement width={180} height={DEFAULT_HEIGHT} />

            <ViewElement width={160} height={DEFAULT_HEIGHT} />

            <ViewElement width={80} height={30} />
        </div>
    );
};

export default memo(_ListProductCardSkeleton);
