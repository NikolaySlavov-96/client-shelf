import { type IProfile, type IUpdateProfileRequest } from '~/Types/services/ProfileService';

import api from './_api';

const PREFIX = '/profile';

const _ProfileServiceFactory = () => {
    const getProfile = (): Promise<IProfile> => api.get(`${PREFIX}`);

    const updateProfile = (data: IUpdateProfileRequest): Promise<IProfile> =>
        api.patch(`${PREFIX}`, { inputData: data });

    return {
        getProfile,
        updateProfile,
    };
};

export default _ProfileServiceFactory;
