import { type StateCreator } from 'zustand';

import { type IProfile, type IUpdateProfileRequest } from '~/Types/services/ProfileService';
import { FileService, ProfileService } from '../../services';

import { type IAuthSlicer } from './AuthSlicer';
import { type ICommonSlicer } from './CommonSlicer';
import { type IModalSlicer } from './ModalSlicer';
import { type IProductSlicer } from './ProductSlicer';
import { type ISupportSlicer } from './SupportSlicer';

export interface IProfileSlicer {
    profile: IProfile | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: IUpdateProfileRequest) => Promise<boolean>;
    updateReadingGoal: (goal: number) => Promise<boolean>;
    uploadAvatar: (file: File, name: string) => Promise<boolean>;
}

type TFullStore = IAuthSlicer & ICommonSlicer & ISupportSlicer & IModalSlicer & IProductSlicer & IProfileSlicer;

let _profileService: ReturnType<typeof ProfileService> | null = null;
const getProfileService = () => (_profileService ??= ProfileService());

const createProfileSlicer: StateCreator<TFullStore, [], [], IProfileSlicer> = (set, get) => ({
    profile: null,

    fetchProfile: async () => {
        try {
            const result = await getProfileService().getProfile();
            set({ profile: result });
        } catch (_err) {
            // silent — profile is non-critical
        }
    },

    updateProfile: async (data) => {
        try {
            const result = await getProfileService().updateProfile(data);
            set({ profile: result });
            return true;
        } catch (_err) {
            return false;
        }
    },

    updateReadingGoal: async (goal: number) => {
        return await get().updateProfile({ readingGoal: goal });
    },

    uploadAvatar: async (file: File, name: string) => {
        try {
            const formData = new FormData();
            formData.append('deliverFile', file);
            formData.append('src', name);

            const fileResponse = await FileService.sendFile(formData as unknown as { deliverFile: File; src: string });

            return await get().updateProfile({ avatarFileId: fileResponse.fileId });
        } catch (_err) {
            return false;
        }
    },
});

export default createProfileSlicer;
