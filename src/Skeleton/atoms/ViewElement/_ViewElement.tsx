import { type FC, memo, useMemo } from 'react';

import style from './_ViewElement.module.css';

const DEFAULT_BORDER_RADIUS = 10;
const DEFAULT_SPACE = 10;

interface IViewElement {
    height: number;
    width: number;
    borderRadius?: number;
    position?: 'start' | 'center' | 'end';
    space?: number;
}

const ViewElement: FC<IViewElement> = (props) => {
    const { borderRadius = DEFAULT_BORDER_RADIUS, height, position = 'center', space = DEFAULT_SPACE, width } = props;

    const containerStyleMemo = useMemo(() => ({ textAlign: position, margin: space }), [position, space]);

    const innerStyleMemo = useMemo(() => ({ width, height, borderRadius }), [width, height, borderRadius]);

    return (
        <div className={style['container']} style={containerStyleMemo}>
            <div className={style['skeleton']} style={innerStyleMemo} />
        </div>
    );
};

export default memo(ViewElement);
