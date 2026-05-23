const C_BROWN = '#8b5e3c';
const C_TAN = '#c49a6c';
const C_SLATE = '#374151';
const C_GREEN = '#2d6a4f';
const C_INDIGO = '#5c6bc0';
const C_ORANGE = '#e67e22';
const C_STONE = '#9c9690';

export const NOT_FOUND_SPINES: readonly { color: string; height: number }[] = [
    { color: C_BROWN, height: 70 },
    { color: C_TAN, height: 90 },
    { color: C_SLATE, height: 110 },
    { color: C_GREEN, height: 80 },
    { color: C_INDIGO, height: 100 },
    { color: C_ORANGE, height: 60 },
    { color: C_STONE, height: 95 },
];

export const BOOK_SPINES: readonly { color: string; height: number }[] = [
    { color: C_BROWN, height: 92 },
    { color: C_TAN, height: 78 },
    { color: C_INDIGO, height: 100 },
    { color: C_GREEN, height: 84 },
    { color: C_ORANGE, height: 70 },
    { color: C_STONE, height: 88 },
];

export const COVER_GRADIENTS: readonly string[] = [
    'linear-gradient(145deg, #5c4b8a, #3d3366)',
    `linear-gradient(145deg, ${C_BROWN}, #6b4528)`,
    `linear-gradient(145deg, ${C_GREEN}, #1b4332)`,
    `linear-gradient(145deg, ${C_SLATE}, #1f2937)`,
    'linear-gradient(145deg, #1e6091, #0d3b6e)',
    'linear-gradient(145deg, #7c3d3d, #5a2020)',
    'linear-gradient(145deg, #8b1a1a, #6b1212)',
    'linear-gradient(145deg, #4a5568, #2d3748)',
    'linear-gradient(145deg, #6b4226, #4a2c18)',
    'linear-gradient(145deg, #1a365d, #0f2340)',
];

export const getCoverGradient = (productId: number): string => COVER_GRADIENTS[productId % COVER_GRADIENTS.length];

export const SEARCH_COVER_GRADIENTS: readonly string[] = [
    'linear-gradient(145deg, #e8d5b7, #c9a96e)',
    'linear-gradient(145deg, #b8d4c8, #7aaa95)',
    'linear-gradient(145deg, #d4b8c8, #a47a95)',
    'linear-gradient(145deg, #b8c4d4, #7a8faa)',
    'linear-gradient(145deg, #d4c8b8, #aa9570)',
    'linear-gradient(145deg, #c8d4b8, #90aa70)',
    'linear-gradient(145deg, #d4b8b8, #aa7070)',
    'linear-gradient(145deg, #b8d4d4, #70aaaa)',
    'linear-gradient(145deg, #c8b8d4, #9070aa)',
    'linear-gradient(145deg, #d4d4b8, #aaaa70)',
];

export const getSearchCoverGradient = (productId: number): string =>
    SEARCH_COVER_GRADIENTS[productId % SEARCH_COVER_GRADIENTS.length];
