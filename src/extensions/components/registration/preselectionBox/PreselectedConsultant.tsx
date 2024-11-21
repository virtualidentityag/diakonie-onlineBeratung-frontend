import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SxProps, Theme, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const PreselectedConsultant = ({
	hasError,
	sx
}: {
	hasError: boolean;
	sx?: SxProps<Theme>;
}) => {
	const { t } = useTranslation();
	if (hasError) {
		return (
			<Typography>
				<ReportProblemIcon
					aria-hidden="true"
					color="inherit"
					sx={{
						width: '20px',
						height: '20px',
						mr: '8px',
						color: '#FF9F00'
					}}
				/>
				{t('registration.errors.cid')}
			</Typography>
		);
	}

	return <Typography sx={sx}> {t('registration.consultantlink')}</Typography>;
};

export default PreselectedConsultant;
