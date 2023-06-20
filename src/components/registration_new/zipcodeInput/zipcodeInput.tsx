import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useState, VFC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';
import { RegistrationContext } from '../../../globalState';

export const ZipcodeInput: VFC = () => {
	const { t } = useTranslation();
	const {
		setDisabledNextButton,
		setDataForSessionStorage,
		sessionStorageRegistrationData
	} = useContext(RegistrationContext);
	const [value, setValue] = useState<string>(
		sessionStorageRegistrationData.zipcode || ''
	);

	useEffect(() => {
		if (value.length === 5) {
			setDisabledNextButton(false);
			setDataForSessionStorage({ zipcode: value });
		} else {
			setDisabledNextButton(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<>
			<Typography variant="h3">
				{t('registration.zipcode.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{t('registration.zipcode.subline')}
			</Typography>
			<Typography>{t('registration.zipcode.bullet1')}</Typography>
			<Typography>{t('registration.zipcode.bullet2')}</Typography>
			<Input
				inputType="number"
				isValueValid={(val: string) => val.length === 5}
				startAdornment={
					<InputAdornment position="start">
						<FmdGoodIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					if (val.length < 6) {
						setValue(val);
					}
				}}
				value={value}
				label={t('registration.zipcode.label')}
			/>
		</>
	);
};
