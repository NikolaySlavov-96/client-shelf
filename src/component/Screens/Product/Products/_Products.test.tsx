import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Products from './_Products';

const mockFetchProducts = jest.fn();

let storeValue: Record<string, unknown>;

jest.mock('../../../../hooks', () => ({
    useStoreZ: () => storeValue,
}));

const MOCK_STATES = [
    { id: 101, stateName: 'Read', symbol: '' },
    { id: 102, stateName: 'Reading', symbol: '' },
    { id: 103, stateName: 'To read', symbol: '' },
];

const renderProducts = () =>
    render(
        <MemoryRouter>
            <Products />
        </MemoryRouter>,
    );

describe('Products status filter', () => {
    beforeEach(() => {
        mockFetchProducts.mockReset();
        storeValue = {
            products: { count: 0, rows: [] },
            fetchProducts: mockFetchProducts,
            pageLimit: 10,
            isLoadingProducts: false,
            isAuthenticated: true,
            addingProductState: jest.fn(),
            productStates: MOCK_STATES,
            fetchAllProductStates: jest.fn(),
        };
    });

    it('fetches with statusId = null on initial render', () => {
        renderProducts();
        expect(mockFetchProducts).toHaveBeenCalledWith(expect.objectContaining({ statusId: null }));
    });

    it('fetches with the mapped statusId when a status filter is chosen', async () => {
        renderProducts();
        mockFetchProducts.mockClear();

        const readingState = MOCK_STATES.find((s) => s.stateName === 'Reading')!;
        await userEvent.click(screen.getByRole('button', { name: readingState.stateName }));

        expect(mockFetchProducts).toHaveBeenCalledWith(expect.objectContaining({ statusId: readingState.id }));
    });

    it('hides status filters for guests', () => {
        storeValue.isAuthenticated = false;
        renderProducts();
        MOCK_STATES.forEach((s) => {
            expect(screen.queryByRole('button', { name: s.stateName })).toBeNull();
        });
    });
});
