import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';

export const ZipcodeInput = () => {
	const { t: translate } = useTranslation();
	const [value, setValue] = useState<string>('');
	return (
		<>
			<Typography variant="h3">
				{translate('registration.zipcode.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{translate('registration.zipcode.subline')}
			</Typography>
			<Typography>{translate('registration.zipcode.bullet1')}</Typography>
			<Typography>{translate('registration.zipcode.bullet2')}</Typography>
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
				label={translate('registration.zipcode.label')}
			></Input>
		</>
	);
};
