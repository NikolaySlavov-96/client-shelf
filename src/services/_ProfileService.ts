import { type IProfile, type IUpdateProfileRequest } from '~/Types/services/ProfileService';

import api from './_api';

// Profile is a separate resource from identity/auth (its own backend router),
// so it can move independently when auth migrates to a provider.
const PREFIX = '/profile';

const _ProfileServiceFactory = () => {
    const getProfile = async (): Promise<IProfile> => api.get(`${PREFIX}`);

    const updateProfile = async (data: IUpdateProfileRequest): Promise<IProfile> =>
        api.patch(`${PREFIX}`, { inputData: data });

    return {
        getProfile,
        updateProfile,
    };
};

export default _ProfileServiceFactory;
