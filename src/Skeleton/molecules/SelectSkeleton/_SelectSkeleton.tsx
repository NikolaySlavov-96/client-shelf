import { memo } from 'react';

import { ViewElement } from '../../atoms';

const _SelectSkeleton = () => {
    return <ViewElement width={300} height={40} />;
};

export default memo(_SelectSkeleton);
