import { type ChangeEvent, type FormEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Button } from '~/component/atoms';

import { ROUT_NAMES, TEXTS } from '~/constants';

import { useStoreZ } from '~/hooks';
import { Toast } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

import styles from './_Settings.module.css';

const MAX_DISPLAY_NAME = 60;

// Avatar upload is temporarily disabled in the UI. Flip to `true` to restore it
// (the API also guards this endpoint to privileged accounts).
const AVATAR_UPLOAD_ENABLED = false;

const Settings = () => {
    const navigate = useNavigate();

    const { profile, fetchProfile, updateProfile, uploadAvatar, isAuthenticated, email } = useStoreZ();

    const [displayName, setDisplayName] = useState('');
    const [notifyByEmail, setNotifyByEmail] = useState(true);
    const [nameError, setNameError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) fetchProfile();
    }, [isAuthenticated, fetchProfile]);

    // Hydrate the form once the profile arrives
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName ?? '');
            setNotifyByEmail(profile.notifyByEmail);
        }
    }, [profile]);

    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setDisplayName(value);
        setNameError(value.length > MAX_DISPLAY_NAME ? TEXTS.SETTINGS_DISPLAY_NAME_ERROR : '');
    }, []);

    const handleAvatarChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setIsUploading(true);
            try {
                const ok = await uploadAvatar(file, file.name);
                Toast({
                    title: ok ? TEXTS.SETTINGS_AVATAR_SUCCESS : TEXTS.SETTINGS_SAVE_ERROR,
                    typeIcon: ok ? ESwalIcon.SUCCESS : ESwalIcon.ERROR,
                });
            } finally {
                setIsUploading(false);
            }
        },
        [uploadAvatar],
    );

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (displayName.length > MAX_DISPLAY_NAME) {
                setNameError(TEXTS.SETTINGS_DISPLAY_NAME_ERROR);
                return;
            }
            setIsSaving(true);
            try {
                const ok = await updateProfile({
                    displayName: displayName.trim() || null,
                    notifyByEmail,
                });
                Toast({
                    title: ok ? TEXTS.SETTINGS_SAVED : TEXTS.SETTINGS_SAVE_ERROR,
                    typeIcon: ok ? ESwalIcon.SUCCESS : ESwalIcon.ERROR,
                });
            } finally {
                setIsSaving(false);
            }
        },
        [displayName, notifyByEmail, updateProfile],
    );

    // Compare the form against the loaded profile, normalising the name the same
    // way handleSubmit persists it (trimmed, empty -> null)
    const isDirty = useMemo(() => {
        if (!profile) return false;
        const nextName = displayName.trim() || null;
        const baselineName = profile.displayName?.trim() || null;
        return nextName !== baselineName || notifyByEmail !== profile.notifyByEmail;
    }, [profile, displayName, notifyByEmail]);

    const initials = (profile?.displayName || email || '').slice(0, 2).toUpperCase();

    return (
        <main className={styles.wrap}>
            <button className={styles.back} type="button" onClick={() => navigate(ROUT_NAMES.USER_COLLECTION)}>
                {TEXTS.SETTINGS_BACK}
            </button>

            <header className={styles.header}>
                <h1 className={styles.title}>{TEXTS.SETTINGS_TITLE}</h1>
                <p className={styles.subtitle}>{TEXTS.SETTINGS_SUBTITLE}</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={`flex-align ${styles.avatarRow}`}>
                    <Avatar initials={initials} src={profile?.avatarUrl ?? undefined} size="lg" />
                    <div>
                        <label className={styles.label} htmlFor="avatar-input">
                            {TEXTS.SETTINGS_LABEL_AVATAR}
                        </label>
                        <input
                            id="avatar-input"
                            className={styles.fileInput}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            disabled={!AVATAR_UPLOAD_ENABLED || isUploading}
                            aria-label={TEXTS.SETTINGS_AVATAR_UPLOAD}
                        />
                        {!AVATAR_UPLOAD_ENABLED ? (
                            <span className={styles.hint}>{TEXTS.SETTINGS_AVATAR_DISABLED}</span>
                        ) : isUploading ? (
                            <span className={styles.hint}>{TEXTS.SETTINGS_AVATAR_UPLOADING}</span>
                        ) : null}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="display-name">
                        {TEXTS.SETTINGS_LABEL_DISPLAY_NAME}
                    </label>
                    <input
                        id="display-name"
                        className={styles.input}
                        type="text"
                        value={displayName}
                        onChange={handleNameChange}
                        placeholder={TEXTS.SETTINGS_PLACEHOLDER_DISPLAY_NAME}
                        maxLength={MAX_DISPLAY_NAME + 10}
                        aria-invalid={!!nameError}
                        aria-describedby={nameError ? 'display-name-error' : undefined}
                    />
                    {nameError ? (
                        <span id="display-name-error" className={styles.error} role="alert">
                            {nameError}
                        </span>
                    ) : null}
                </div>

                <div className={styles.field}>
                    <label className={styles.checkboxRow} htmlFor="notify-email">
                        <input
                            id="notify-email"
                            type="checkbox"
                            checked={notifyByEmail}
                            onChange={(e) => setNotifyByEmail(e.target.checked)}
                        />
                        <span>
                            <span className={styles.label}>{TEXTS.SETTINGS_LABEL_NOTIFY}</span>
                            <span className={styles.hint}>{TEXTS.SETTINGS_NOTIFY_HINT}</span>
                        </span>
                    </label>
                </div>

                <Button
                    label={TEXTS.SETTINGS_SAVE}
                    variant="primary"
                    size="md"
                    type="submit"
                    isLoading={isSaving}
                    isDisabled={!!nameError || !isDirty}
                />
            </form>
        </main>
    );
};

export default memo(Settings);
