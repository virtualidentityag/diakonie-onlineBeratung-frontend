import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SxProps, Theme, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { AgencyDataInterface } from '../../../../globalState/interfaces';

const PreselectedAgency = ({
	hasError,
	agency,
	sx
}: {
	hasError: boolean;
	agency: AgencyDataInterface;
	sx?: SxProps<Theme>;
}) => {
	const { t } = useTranslation();

	if (!hasError && !agency) {
		return null;
	}

	return (
		<>
			<Typography
				sx={{
					...sx,
					fontWeight: '600',
					mb: '8px',
					mt: '16px'
				}}
			>
				{t('registration.agency.summary')}
			</Typography>
			{hasError ? (
				<Typography>
					<>
						<ReportProblemIcon
							aria-hidden="true"
							color="inherit"
							sx={{
								width: '20px',
								height: '20px',
								mr: '8px',
								color: '#FF9F00',
								...sx
							}}
						/>
						{t('registration.errors.aid')}
					</>
				</Typography>
			) : (
				<Typography sx={{ ...sx, mt: '8px' }}>{agency.name}</Typography>
			)}
		</>
	);
};

export default PreselectedAgency;
