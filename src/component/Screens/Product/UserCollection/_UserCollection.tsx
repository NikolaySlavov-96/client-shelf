import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Avatar, Button, Stat } from '~/component/atoms';

import { Pagination, ProgressBar, ShelfTabs } from '~/component/molecules';

import { ShelfGrid } from '~/component/organisms';

import { ROUT_NAMES, SEARCH_NAME, TEXTS } from '~/constants';
import { EStatusId } from '~/constants/statusMap';

import { useStoreZ } from '~/hooks';

import styles from './_UserCollection.module.css';

// statusId 0 is the synthetic "All" tab; every other tab comes from the DB-backed state list
const ALL_STATUS_ID = 0;

const DEFAULT_GOAL = 12;

const UserCollection = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const statusParam = Number(searchParams.get(SEARCH_NAME.STATUS));
    const activeStatusId = Number.isInteger(statusParam) && statusParam > 0 ? statusParam : ALL_STATUS_ID;
    const pageParam = Number(searchParams.get(SEARCH_NAME.PAGE));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const updateParams = useCallback(
        (mutate: (params: URLSearchParams) => void) => {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                mutate(params);
                return params;
            });
        },
        [setSearchParams],
    );

    const setPage = useCallback(
        (next: number) => {
            updateParams((p) => {
                if (next <= 1) {
                    p.delete(SEARCH_NAME.PAGE);
                } else {
                    p.set(SEARCH_NAME.PAGE, String(next));
                }
            });
        },
        [updateParams],
    );

    const [friendEmail, setFriendEmail] = useState('');
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [goalDraft, setGoalDraft] = useState('');

    const {
        email,
        productStates,
        fetchAllProductStates,
        productCollection,
        fetchProductCollection,
        removeProductState,
        updateShelfStatus,
        statusCounts,
        fetchStatusCounts,
        profile,
        fetchProfile,
        updateReadingGoal,
        pageLimit,
        isLoadingProductCollection,
    } = useStoreZ();

    const initials = profile?.displayName || email ? (profile?.displayName ?? email).slice(0, 2).toUpperCase() : '';
    const username = profile?.displayName || (email ? email.split('@')[0] : TEXTS.NAV_GUEST);
    const readingGoal = profile?.readingGoal ?? DEFAULT_GOAL;

    // The available statuses are data: they come from the API, not the client
    useEffect(() => {
        fetchAllProductStates();
    }, [fetchAllProductStates]);

    // Server-side: re-fetch the current page whenever the tab or page changes
    useEffect(() => {
        fetchProductCollection({
            page,
            limit: pageLimit,
            type: activeStatusId,
            searchContent: '',
        });
    }, [fetchProductCollection, page, pageLimit, activeStatusId]);

    // Accurate per-tab counts come from a lightweight aggregate endpoint
    useEffect(() => {
        fetchStatusCounts();
    }, [fetchStatusCounts]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleStartEditGoal = useCallback(() => {
        setGoalDraft(String(readingGoal));
        setIsEditingGoal(true);
    }, [readingGoal]);

    const handleSaveGoal = useCallback(async () => {
        const next = parseInt(goalDraft, 10);
        if (Number.isFinite(next) && next >= 1 && next <= 999) {
            await updateReadingGoal(next);
        }
        setIsEditingGoal(false);
    }, [goalDraft, updateReadingGoal]);

    const countFor = useCallback(
        (statusId: number) => statusCounts.find((c) => c.statusId === statusId)?.count ?? 0,
        [statusCounts],
    );
    const totalCount = useMemo(() => statusCounts.reduce((sum, c) => sum + c.count, 0), [statusCounts]);

    // Tabs are built from whatever the API returns: no states → no tabs at all
    const tabsWithCount = useMemo(() => {
        if (productStates.length === 0) {
            return [];
        }

        return [
            {
                value: String(ALL_STATUS_ID),
                label: TEXTS.SHELF_TAB_ALL,
                count: totalCount,
            },
            ...productStates.map((s) => ({
                value: String(s.id),
                label: s.symbol ? `${s.symbol} ${s.stateName}` : s.stateName,
                count: countFor(s.id),
            })),
        ];
    }, [productStates, totalCount, countFor]);

    const readCount = countFor(EStatusId.READ);
    const readingCount = countFor(EStatusId.READING);
    const listenedCount = countFor(EStatusId.LISTENED);

    const pageCount = Math.ceil(productCollection.count / pageLimit) || 0;

    const handleTabSelect = useCallback(
        (v: string) => {
            const nextStatusId = Number(v);
            if (Number.isFinite(nextStatusId)) {
                updateParams((p) => {
                    if (nextStatusId === ALL_STATUS_ID) {
                        p.delete(SEARCH_NAME.STATUS);
                    } else {
                        p.set(SEARCH_NAME.STATUS, String(nextStatusId));
                    }
                    p.delete(SEARCH_NAME.PAGE); // switching tabs resets to the first page
                });
            }
        },
        [updateParams],
    );

    const handleStatusChange = useCallback(
        (productId: number, nextStatusId: number) => {
            updateShelfStatus(productId, nextStatusId, activeStatusId);
        },
        [updateShelfStatus, activeStatusId],
    );

    const handleFriendView = useCallback(() => {
        if (friendEmail.trim()) {
            navigate(
                `${ROUT_NAMES.REVIEW_PRODUCTS_BY_EMAIL.replace(':email', '')}${encodeURIComponent(friendEmail.trim())}`,
            );
        }
    }, [friendEmail, navigate]);

    return (
        <main className={styles.wrap}>
            <header className={styles.header}>
                <Avatar initials={initials} src={profile?.avatarUrl ?? undefined} size="lg" />
                <div className={styles.header__info}>
                    <h1 className={styles.header__name}>{username}</h1>
                    <p className={styles.header__email}>{email}</p>
                    <div className={styles.stats}>
                        <Stat value={totalCount} label={TEXTS.PROFILE_STAT_TOTAL} />
                        <Stat value={readCount} label={TEXTS.PROFILE_STAT_READ} />
                        <Stat value={readingCount} label={TEXTS.PROFILE_STAT_READING} />
                        <Stat value={listenedCount} label={TEXTS.PROFILE_STAT_LISTENED} />
                    </div>
                </div>
                <div className={styles.header__actions}>
                    <Button
                        label={TEXTS.PROFILE_SETTINGS}
                        variant="outline"
                        size="md"
                        onClick={() => navigate(ROUT_NAMES.SETTINGS)}
                        ariaLabel={TEXTS.PROFILE_SETTINGS}
                    />
                </div>
            </header>

            <div className={`flex-align ${styles.goalRow}`}>
                <ProgressBar current={readCount + listenedCount} goal={readingGoal} label={TEXTS.PROFILE_GOAL_LABEL} />
                {isEditingGoal ? (
                    <div className="flex-align">
                        <label className={styles.srOnly} htmlFor="reading-goal">
                            {TEXTS.PROFILE_GOAL_INPUT_LABEL}
                        </label>
                        <input
                            id="reading-goal"
                            className={styles.goalInput}
                            type="number"
                            min={1}
                            max={999}
                            value={goalDraft}
                            onChange={(e) => setGoalDraft(e.target.value)}
                            onKeyDown={(e) => (e.key === 'Enter' ? handleSaveGoal() : undefined)}
                            autoFocus
                        />
                        <button className={styles.goalBtn} type="button" onClick={handleSaveGoal}>
                            {TEXTS.PROFILE_GOAL_SAVE}
                        </button>
                        <button className={styles.goalBtn} type="button" onClick={() => setIsEditingGoal(false)}>
                            {TEXTS.PROFILE_GOAL_CANCEL}
                        </button>
                    </div>
                ) : (
                    <button
                        className={styles.goalBtn}
                        type="button"
                        onClick={handleStartEditGoal}
                        aria-label={TEXTS.PROFILE_GOAL_EDIT}
                    >
                        {TEXTS.PROFILE_GOAL_EDIT}
                    </button>
                )}
            </div>

            <div className={`flex-align ${styles.friendBar}`}>
                <label className={styles.friendBar__label} htmlFor="friend-email">
                    {TEXTS.PROFILE_FRIEND_LABEL}
                </label>
                <input
                    id="friend-email"
                    className={styles.friendBar__input}
                    type="email"
                    placeholder={TEXTS.PROFILE_FRIEND_PLACEHOLDER}
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    onKeyDown={(e) => (e.key === 'Enter' ? handleFriendView() : undefined)}
                />
                <Button
                    label={TEXTS.PROFILE_FRIEND_BTN}
                    onClick={handleFriendView}
                    ariaLabel={TEXTS.PROFILE_FRIEND_BTN}
                />
            </div>

            <ShelfTabs tabs={tabsWithCount} activeValue={String(activeStatusId)} onSelect={handleTabSelect} />

            {isLoadingProductCollection ? (
                <div className={styles.loading}>{TEXTS.COMMON_LOADING}</div>
            ) : (
                <>
                    <ShelfGrid
                        books={productCollection.rows}
                        onRemove={removeProductState}
                        onStatusChange={handleStatusChange}
                    />
                    <Pagination count={pageCount} page={page} onSubmit={setPage} />
                </>
            )}
        </main>
    );
};

export default memo(UserCollection);
