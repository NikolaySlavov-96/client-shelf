import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StarRating from './StarRating';

describe('StarRating', () => {
    it('renders read-only without buttons', () => {
        render(<StarRating value={3} ariaLabel="Rating" />);
        expect(screen.queryByRole('radio')).toBeNull();
        expect(screen.getByLabelText('Rating: 3 of 5')).toBeInTheDocument();
    });

    it('calls onRate on click when interactive', async () => {
        const onRate = jest.fn();
        render(<StarRating value={0} interactive onRate={onRate} />);

        await userEvent.click(screen.getByRole('radio', { name: '4 stars' }));
        expect(onRate).toHaveBeenCalledWith(4);
    });

    it('calls onRate on keyboard activation', async () => {
        const onRate = jest.fn();
        render(<StarRating value={0} interactive onRate={onRate} />);

        const secondStar = screen.getByRole('radio', { name: '2 stars' });
        secondStar.focus();
        await userEvent.keyboard('{Enter}');
        expect(onRate).toHaveBeenCalledWith(2);
    });

    it('marks the selected star as checked', () => {
        render(<StarRating value={5} interactive onRate={jest.fn()} />);
        expect(screen.getByRole('radio', { name: '5 stars' })).toHaveAttribute('aria-checked', 'true');
    });
});
