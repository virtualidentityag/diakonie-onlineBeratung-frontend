import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SxProps, Theme, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { TopicsDataInterface } from '../../../../globalState/interfaces';

const PreselectedTopic = ({
	hasError,
	topic,
	sx
}: {
	hasError: boolean;
	topic: TopicsDataInterface;
	sx?: SxProps<Theme>;
}) => {
	const { t } = useTranslation();

	if (!hasError && !topic) {
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
				{t('registration.topic.summary')}
			</Typography>
			{hasError ? (
				<Typography sx={sx}>
					<>
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
						{t('registration.errors.tid')}
					</>
				</Typography>
			) : (
				<Typography sx={{ ...sx, mt: '8px' }}>
					{topic.titles?.long || topic.name}
				</Typography>
			)}
		</>
	);
};

export default PreselectedTopic;
