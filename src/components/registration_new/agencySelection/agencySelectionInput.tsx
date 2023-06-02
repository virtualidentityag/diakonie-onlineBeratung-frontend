import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';

interface AgencySelectionInputProps {
	value: string;
	onInputChange(val: string): void;
}

export const AgencySelectionInput = ({
	value,
	onInputChange
}: AgencySelectionInputProps) => {
	const { t: translate } = useTranslation();

	return (
		<>
			<Typography variant="h3">
				{translate('registration.agency.headline')}
			</Typography>
			<Input
				onInputChange={(val) => {
					if (val.length < 6) {
						onInputChange(val);
					}
				}}
				value={value}
				label={translate('registration.agency.search')}
				inputType="number"
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
			></Input>
		</>
	);
};
