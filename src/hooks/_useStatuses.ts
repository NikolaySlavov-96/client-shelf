import { useCallback, useEffect } from 'react';

import useStoreZ from './_useStoreZ';

/**
 * Single source of truth for "what statuses exist and what are they called".
 * The list and its labels come from the API (`GET /status/all`) via the store —
 * nothing is hardcoded here. If the API returns nothing, `statuses` is empty
 * and callers render nothing.
 */
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
