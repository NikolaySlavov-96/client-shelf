import { useCallback, useEffect, useState } from 'react';

const useDeviceDetector = () => {
    const [device, setDevice] = useState('');

    const handlerDeviceDetector = useCallback(() => {
        const userAgent = navigator.userAgent.toLocaleLowerCase();
        const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
        const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

        if (isMobile) {
            setDevice('Mobile');
        } else if (isTablet) {
            setDevice('Tabled');
        } else {
            setDevice('Desktop');
        }
    }, []);

    useEffect(() => {
        handlerDeviceDetector();
        window.addEventListener('resize', handlerDeviceDetector);

        return () => {
            window.removeEventListener('resize', handlerDeviceDetector);
        };
    }, []);

    return device;
};

export default useDeviceDetector;
