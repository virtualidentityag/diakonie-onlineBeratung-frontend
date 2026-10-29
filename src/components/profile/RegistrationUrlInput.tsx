import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';

/** the registration redirect URL must point at this domain or a subdomain of it. */
export const ALLOWED_REGISTRATION_DOMAIN = 'diakonie.de';

/**
 * Accepts only an absolute https URL without user-info whose host is exactly the allowed domain or a
 * subdomain of it. This rejects look-alike bypasses such as
 * `https://diakonie.de.evil.com`, `https://evil-diakonie.de`,
 * `https://evil.com/diakonie.de` and `https://diakonie.de@evil.com`.
 */
export const isValidRegistrationUrl = (value: string): boolean => {
	let url: URL;
	try {
		url = new URL(value.trim());
	} catch {
		return false;
	}
	if (url.protocol !== 'https:' || url.username || url.password) {
		return false;
	}
	const host = url.hostname.toLowerCase();
	return (
		host === ALLOWED_REGISTRATION_DOMAIN ||
		host.endsWith(`.${ALLOWED_REGISTRATION_DOMAIN}`)
	);
};

type RegistrationUrlInputProps = {
	initialValue?: string;
	onSave: (url: string) => Promise<any>;
	onDelete: () => Promise<any>;
};

export const RegistrationUrlInput = ({
	initialValue,
	onSave,
	onDelete
}: RegistrationUrlInputProps) => {
	const { t: translate } = useTranslation();
	const [value, setValue] = useState(initialValue ?? '');
	// track the last persisted value locally so the buttons update
	// immediately after a successful save/delete, independent of the reload round-trip.
	const [savedValue, setSavedValue] = useState(initialValue ?? '');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValue(initialValue ?? '');
		setSavedValue(initialValue ?? '');
	}, [initialValue]);

	const trimmed = value.trim();
	const hasStoredValue = savedValue.length > 0;
	const isDirty = trimmed !== savedValue;
	const showInvalid = trimmed.length > 0 && !isValidRegistrationUrl(trimmed);
	const isSaveDisabled =
		isSubmitting || !isDirty || trimmed.length === 0 || showInvalid;

	const handleSave = () => {
		if (isSaveDisabled) {
			return;
		}
		setIsSubmitting(true);
		onSave(trimmed)
			.then(() => setSavedValue(trimmed))
			.finally(() => setIsSubmitting(false));
	};

	const handleDelete = () => {
		setIsSubmitting(true);
		onDelete()
			.then(() => {
				setSavedValue('');
				setValue('');
			})
			.finally(() => setIsSubmitting(false));
	};

	const saveButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.registrationLink.override.save'),
		type: BUTTON_TYPES.LINK
	};

	const deleteButton: ButtonItem = {
		disabled: isSubmitting,
		label: translate('profile.data.registrationLink.override.delete'),
		type: BUTTON_TYPES.LINK
	};

	return (
		<div className="profile__registrationUrlOverride mt--1">
			<label
				className="text--small tertiary"
				htmlFor="registrationUrlOverride"
			>
				{translate('profile.data.registrationLink.override.label')}
			</label>
			<input
				id="registrationUrlOverride"
				type="url"
				className="profile__registrationUrlOverride__input"
				value={value}
				placeholder={translate(
					'profile.data.registrationLink.override.placeholder'
				)}
				onChange={(e) => setValue(e.target.value)}
			/>
			{showInvalid && (
				<Text
					text={translate(
						'profile.data.registrationLink.override.invalid'
					)}
					type="infoSmall"
					className="profile__registrationUrlOverride__error"
				/>
			)}
			<div className="editableData__buttonSet">
				<Button item={saveButton} buttonHandle={handleSave} />
				{hasStoredValue && (
					<Button item={deleteButton} buttonHandle={handleDelete} />
				)}
			</div>
		</div>
	);
};
