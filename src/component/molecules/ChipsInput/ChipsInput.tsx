import { type KeyboardEvent, memo, useCallback, useState } from 'react';

import styles from './ChipsInput.module.css';

interface IChipsInputProps {
    id: string;
    values: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    minLengthPerChip?: number;
    ariaLabel?: string;
}

function ChipsInput({ id, values, onChange, placeholder, minLengthPerChip = 2, ariaLabel }: IChipsInputProps) {
    const [draft, setDraft] = useState('');

    const commit = useCallback(() => {
        const trimmed = draft.trim();
        if (trimmed.length < minLengthPerChip) {
            return;
        }
        if (values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
            setDraft('');
            return;
        }
        onChange([...values, trimmed]);
        setDraft('');
    }, [draft, minLengthPerChip, onChange, values]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                commit();
                return;
            }
            if (e.key === 'Backspace' && draft.length === 0 && values.length > 0) {
                e.preventDefault();
                onChange(values.slice(0, -1));
            }
        },
        [commit, draft, onChange, values],
    );

    const handleRemove = useCallback(
        (index: number) => {
            onChange(values.filter((_, i) => i !== index));
        },
        [onChange, values],
    );

    return (
        <div className={styles.wrap}>
            {values.map((value, index) => (
                <span key={`${value}-${index}`} className={styles.chip}>
                    <span className={styles.chip__label}>{value}</span>
                    <button
                        type="button"
                        className={styles.chip__remove}
                        onClick={() => handleRemove(index)}
                        aria-label={`Remove ${value}`}
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                id={id}
                type="text"
                className={styles.input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={commit}
                placeholder={values.length === 0 ? placeholder : ''}
                aria-label={ariaLabel ?? placeholder}
            />
        </div>
    );
}

export default memo(ChipsInput);
