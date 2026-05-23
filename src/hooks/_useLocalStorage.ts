import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: Record<string, unknown>) => {
    const [state, setState] = useState(() => {
        const persist = localStorage.getItem(key);

        if (persist) {
            const persistState = JSON.parse(persist);
            return persistState;
        }
        return initialValue;
    });

    // useEffect(() => {
    //     if (key === STORAGE_KEYS.UN_ID) {
    //         const persist = localStorage.getItem(key);
    //         console.log("🚀 ~ useEffect ~ persist:", persist)
    //         if (persist) {
    //             const connectId = JSON.parse(persist);
    //             setUnId(connectId)
    //         }
    //     }
    // }, []);

    // const saveToLocalStorage = (value) => {
    //     setData(value);
    //     localStorage.setItem(key, JSON.stringify(value));
    //   };

    const setLocalStorage = (value: any) => {
        setState(value);

        localStorage.setItem(key, JSON.stringify(value));
    };

    return [state, setLocalStorage];
};

export default useLocalStorage;
