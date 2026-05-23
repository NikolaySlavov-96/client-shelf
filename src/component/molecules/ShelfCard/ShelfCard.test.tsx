import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TEXTS } from '~/constants';

import ShelfCard from './ShelfCard';

const mockToastWithButton = jest.fn();
const mockToast = jest.fn();

jest.mock('../../../Toasts', () => ({
    ToastWithButton: (args: unknown) => mockToastWithButton(args),
    Toast: (args: unknown) => mockToast(args),
}));

const baseProps = {
    productId: 7,
    productTitle: 'Dune',
    authorName: 'Frank Herbert',
    statusId: 1,
};

describe('ShelfCard remove', () => {
    beforeEach(() => {
        mockToastWithButton.mockReset();
        mockToast.mockReset();
    });

    it('does not render the remove button without onRemove', () => {
        render(<ShelfCard {...baseProps} />);
        expect(screen.queryByRole('button', { name: new RegExp(TEXTS.PROFILE_REMOVE) })).toBeNull();
    });

    it('calls onRemove when the user confirms', async () => {
        mockToastWithButton.mockResolvedValue({ isConfirmed: true });
        const onRemove = jest.fn();

        render(<ShelfCard {...baseProps} onRemove={onRemove} />);
        await userEvent.click(screen.getByRole('button', { name: new RegExp(TEXTS.PROFILE_REMOVE) }));

        await waitFor(() => expect(onRemove).toHaveBeenCalledWith(7));
        expect(mockToast).toHaveBeenCalled();
    });

    it('does not call onRemove when the user cancels', async () => {
        mockToastWithButton.mockResolvedValue({ isConfirmed: false });
        const onRemove = jest.fn();

        render(<ShelfCard {...baseProps} onRemove={onRemove} />);
        await userEvent.click(screen.getByRole('button', { name: new RegExp(TEXTS.PROFILE_REMOVE) }));

        await waitFor(() => expect(mockToastWithButton).toHaveBeenCalled());
        expect(onRemove).not.toHaveBeenCalled();
    });
});
