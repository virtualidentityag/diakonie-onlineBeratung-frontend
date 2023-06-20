import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';

export const ZipcodeInput: VFC = () => {
	const { t } = useTranslation();
	const [value, setValue] = useState<string>('');
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
				autoComplete="postal-code"
				inputMode="numeric"
				inputType="text"
				isValueValid={(val: string) => val.length === 5}
				startAdornment={
					<InputAdornment position="start">
						<FmdGoodIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					const reg = /^\d*$/;
					if (val.length < 6 && reg.test(val)) {
						setValue(val);
					}
				}}
				value={value}
				label={t('registration.zipcode.label')}
			/>
		</>
	);
};
