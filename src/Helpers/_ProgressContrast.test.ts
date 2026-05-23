import { getProgressContrast, PROGRESS_CONTRAST_THRESHOLDS } from './_ProgressContrast';

describe('getProgressContrast', () => {
    describe('with default thresholds (label > 10, value > 75)', () => {
        it.each([
            { pct: 0, label: false, value: false },
            { pct: 10, label: false, value: false },
            { pct: 10.01, label: true, value: false },
            { pct: 50, label: true, value: false },
            { pct: 75, label: true, value: false },
            { pct: 75.01, label: true, value: true },
            { pct: 100, label: true, value: true },
        ])('pct=$pct → label=$label, value=$value', ({ pct, label, value }) => {
            expect(getProgressContrast(pct)).toEqual({ label, value });
        });
    });

    it('flips nothing when both texts are below their thresholds', () => {
        expect(getProgressContrast(5)).toEqual({ label: false, value: false });
    });

    it('flips only the label inside the middle band', () => {
        expect(getProgressContrast(40)).toEqual({ label: true, value: false });
    });

    it('flips both texts past the upper threshold', () => {
        expect(getProgressContrast(90)).toEqual({ label: true, value: true });
    });

    it('accepts custom thresholds so callers can tune breakpoints', () => {
        const custom = { label: 25, value: 60 };
        expect(getProgressContrast(20, custom)).toEqual({ label: false, value: false });
        expect(getProgressContrast(50, custom)).toEqual({ label: true, value: false });
        expect(getProgressContrast(80, custom)).toEqual({ label: true, value: true });
    });

    it('exposes the default thresholds for callers that want to inspect or extend them', () => {
        expect(PROGRESS_CONTRAST_THRESHOLDS).toEqual({ label: 10, value: 75 });
    });
});
