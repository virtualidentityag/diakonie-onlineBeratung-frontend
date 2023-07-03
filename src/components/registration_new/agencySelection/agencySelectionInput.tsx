import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import { VFC, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Input } from '../../input/input';
import { RegistrationContext } from '../../../globalState';

interface AgencySelectionInputProps {
	value: string;
	onInputChange(val: string): void;
}

export const AgencySelectionInput: VFC<AgencySelectionInputProps> = ({
	value,
	onInputChange
}) => {
	const { t } = useTranslation();
	const { isConsultantLink, consultant } = useContext(RegistrationContext);

	return (
		<>
			<Typography variant="h3">
				{isConsultantLink && consultant?.agencies?.length === 1
					? t('registration.agency.consultantheadline')
					: t('registration.agency.headline')}
			</Typography>
			{!isConsultantLink && (
				<Input
					onInputChange={(val) => {
						if (val?.length < 6) {
							onInputChange(val);
						}
					}}
					inputMode="numeric"
					inputType="text"
					value={value}
					label={t('registration.agency.search')}
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
								tabIndex={0}
								onClick={() => {
									onInputChange('');
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										onInputChange('');
									}
								}}
							/>
						</InputAdornment>
					}
				/>
			)}
		</>
	);
};
