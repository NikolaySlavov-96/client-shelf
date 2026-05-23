import { useCallback, useEffect } from 'react';

import useStoreZ from './_useStoreZ';

const useStatuses = () => {
    const statuses = useStoreZ((s) => s.productStates);
    const fetchAllProductStates = useStoreZ((s) => s.fetchAllProductStates);

    useEffect(() => {
        if (statuses.length === 0) {
            fetchAllProductStates();
        }
    }, [statuses.length, fetchAllProductStates]);

    const getLabel = useCallback((id: number) => statuses.find((s) => s.id === id)?.stateName ?? '', [statuses]);

    return { statuses, getLabel };
};

export default useStatuses;
