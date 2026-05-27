import { useCallback, useEffect, useState } from 'react';

import { createLogger } from '~/Utils';

const log = createLogger('useGetUserAddress');

const DOMAIN = 'https://geolocation-db.com/json/';
// https://api.ipify.org/?format=json

const useGetUserAddress = () => {
    const [userData, setUserData] = useState({});

    const checkUserAddress = useCallback(async () => {
        try {
            const test = await fetch(DOMAIN);
            const result = await test.json();
            setUserData(result);
        } catch (err) {
            log.error('checkUserAddress failed', err);
        }
    }, []);

    useEffect(() => {
        checkUserAddress();
    }, []);

    return userData;
};

export default useGetUserAddress;
