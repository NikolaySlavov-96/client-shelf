import { type ReactNode } from 'react';

import { StarRating } from '~/component/atoms';

import { TEXTS } from '~/constants';

interface IProductDetailStat {
    id: string;
    label: string;
    value: ReactNode;
}

interface IProductDetailStatsInput {
    pages: number | null | undefined;
    publishedYear: number | null | undefined;
    rating: { average: number; count: number };
}

export const getProductDetailStats = ({
    pages,
    publishedYear,
    rating,
}: IProductDetailStatsInput): IProductDetailStat[] => [
    {
        id: 'pages',
        label: TEXTS.DETAIL_PAGES,
        value: pages ?? TEXTS.COMMON_PLACEHOLDER_VALUE,
    },
    {
        id: 'year',
        label: TEXTS.DETAIL_YEAR,
        value: publishedYear ?? TEXTS.COMMON_PLACEHOLDER_VALUE,
    },
    {
        id: 'rating',
        label: `${TEXTS.DETAIL_RATING}${rating.count > 0 ? ` (${rating.count})` : ''}`,
        value: <StarRating value={Math.round(rating.average)} ariaLabel={TEXTS.DETAIL_RATING} />,
    },
];
