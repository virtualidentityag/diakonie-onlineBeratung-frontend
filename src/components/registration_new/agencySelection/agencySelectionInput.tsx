import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import { VFC } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';

interface AgencySelectionInputProps {
	value: string;
	onInputChange(val: string): void;
}

export const AgencySelectionInput: VFC<AgencySelectionInputProps> = ({
	value,
	onInputChange
}) => {
	const { t } = useTranslation();

	return (
		<>
			<Typography variant="h3">
				{t('registration.agency.headline')}
			</Typography>
			<Input
				onInputChange={(val) => {
					const reg = /^\d*$/;
					if (val.length < 6 && reg.test(val)) {
						onInputChange(val);
					}
				}}
				autoComplete="postal-code"
				value={value}
				label={t('registration.agency.search')}
				inputMode="numeric"
				inputType="text"
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon color="info" />
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment position="end">
						<CloseIcon
							sx={{ cursor: 'pointer' }}
							color="info"
							onClick={() => {
								onInputChange('');
							}}
						/>
					</InputAdornment>
				}
			/>
		</>
	);
};
