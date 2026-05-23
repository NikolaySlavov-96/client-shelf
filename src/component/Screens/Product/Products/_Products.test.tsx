import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EStatusId } from '~/constants/statusMap';

import Products from './_Products';

const mockFetchProducts = jest.fn();

let storeValue: Record<string, unknown>;

jest.mock('../../../../hooks', () => ({
    useStoreZ: () => storeValue,
}));

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
            // status filters are data-driven: the list comes from the API/store
            productStates: [
                { id: EStatusId.READ, stateName: 'Read', symbol: '' },
                { id: EStatusId.READING, stateName: 'Reading', symbol: '' },
                { id: EStatusId.WANT, stateName: 'To read', symbol: '' },
            ],
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

        await userEvent.click(screen.getByRole('button', { name: 'Reading' }));

        expect(mockFetchProducts).toHaveBeenCalledWith(expect.objectContaining({ statusId: EStatusId.READING }));
    });

    it('hides status filters for guests', () => {
        storeValue.isAuthenticated = false;
        renderProducts();
        expect(screen.queryByRole('button', { name: 'Reading' })).toBeNull();
    });
});
