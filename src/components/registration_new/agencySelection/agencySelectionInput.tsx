import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import { useState, VFC } from 'react';
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
	const [shrinkInputLabel, setShrinkInputLabel] = useState<boolean>(false);

	return (
		<>
			<Typography variant="h3">
				{t('registration.agency.headline')}
			</Typography>
			<Input
				shrinkLabel={shrinkInputLabel}
				onInputChange={(val) => {
					if (val?.length < 6) {
						setShrinkInputLabel(true);
						onInputChange(val);
					}
				}}
				value={value}
				label={t('registration.agency.search')}
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
								setShrinkInputLabel(false);
							}}
						/>
					</InputAdornment>
				}
			/>
		</>
	);
};
