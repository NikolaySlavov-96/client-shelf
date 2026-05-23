import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TEXTS } from '~/constants';

import Settings from './_Settings';

const mockUpdateProfile = jest.fn();
const mockFetchProfile = jest.fn();
const mockUploadAvatar = jest.fn();

let storeValue: Record<string, unknown>;

jest.mock('../../../../hooks', () => ({
    useStoreZ: () => storeValue,
}));

jest.mock('../../../../Toasts', () => ({
    Toast: jest.fn(),
}));

const renderSettings = () =>
    render(
        <MemoryRouter>
            <Settings />
        </MemoryRouter>,
    );

describe('Settings form validation', () => {
    beforeEach(() => {
        mockUpdateProfile.mockReset().mockResolvedValue(true);
        mockFetchProfile.mockReset();
        mockUploadAvatar.mockReset();
        storeValue = {
            isAuthenticated: true,
            profile: { displayName: 'Jane', notifyByEmail: true, email: 'jane@example.com', avatarUrl: null },
            fetchProfile: mockFetchProfile,
            updateProfile: mockUpdateProfile,
            uploadAvatar: mockUploadAvatar,
        };
    });

    it('saves a valid display name', async () => {
        renderSettings();

        const input = screen.getByLabelText(TEXTS.SETTINGS_LABEL_DISPLAY_NAME);
        await userEvent.clear(input);
        await userEvent.type(input, 'New Name');
        await userEvent.click(screen.getByRole('button', { name: TEXTS.SETTINGS_SAVE }));

        await waitFor(() =>
            expect(mockUpdateProfile).toHaveBeenCalledWith(
                expect.objectContaining({ displayName: 'New Name', notifyByEmail: true }),
            ),
        );
    });

    it('shows an error and blocks save when the display name is too long', async () => {
        renderSettings();

        const input = screen.getByLabelText(TEXTS.SETTINGS_LABEL_DISPLAY_NAME);
        await userEvent.clear(input);
        await userEvent.type(input, 'x'.repeat(61));

        expect(screen.getByRole('alert')).toHaveTextContent(TEXTS.SETTINGS_DISPLAY_NAME_ERROR);
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(mockUpdateProfile).not.toHaveBeenCalled();
    });
});
