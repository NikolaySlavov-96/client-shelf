import { useState } from 'react';

import { type TViewType } from '~/Types/Components';

const useViewType = (inViewType?: TViewType) => {
    const [viewType, setViewType] = useState<TViewType>(inViewType ?? 'list');

    const onChangeViewType = (viewTypeParam: TViewType) => {
        setViewType(viewTypeParam);
    };

    return {
        viewType,
        onChangeViewType,
    };
};

export default useViewType;
