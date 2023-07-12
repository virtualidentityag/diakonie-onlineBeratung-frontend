import * as React from 'react';
import { useContext, useState, useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { RegistrationContext } from '../../../globalState';
import { PreselectedDataDrawer } from '../preselectedDataDrawer/PreselectedDataDrawer';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export const PreselectedDataBox: VFC<{
	hasDrawer?: boolean;
}> = ({ hasDrawer = false }) => {
	const {
		preselectedAgency,
		preselectedTopicName,
		isConsultantLink,
		hasConsultantError,
		hasTopicError,
		hasAgencyError,
		preselectedData
	} = useContext(RegistrationContext);
	const { t } = useTranslation();
	const [topicName, setTopicName] = useState('-');
	const [agencyName, setAgencyName] = useState('-');

	useEffect(() => {
		if (preselectedTopicName) {
			setTopicName(preselectedTopicName);
		}
		if (preselectedAgency) {
			setAgencyName(preselectedAgency?.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedAgency, preselectedTopicName]);
	console.log(preselectedData);
	// if (hasConsultantError || hasTopicError || hasAgencyError) {
	// 	return (
	// 		<Box
	// 			sx={{
	// 				display: {
	// 					xs: 'none',
	// 					md: 'block'
	// 				},
	// 				gridTemplateColumns: 'auto 1fr',
	// 				gridColumnGap: '24px',
	// 				gridRowGap: '16px',
	// 				p: '16px',
	// 				my: '32px',
	// 				borderRadius: '4px',
	// 				border: '1px solid #c6c5c4'
	// 			}}
	// 		>
	// 			{hasConsultantError && (
	// 				<Typography>
	// 					<ReportProblemIcon
	// 						aria-hidden="true"
	// 						color="inherit"
	// 						sx={{
	// 							width: '20px',
	// 							height: '20px',
	// 							mr: '8px',
	// 							color: '#FF9F00'
	// 						}}
	// 					/>
	// 					{t('registration.errors.cid')}
	// 				</Typography>
	// 			)}
	// 			{hasTopicError && (
	// 				<>
	// 					<Typography
	// 						sx={{
	// 							fontWeight: '600',
	// 							mb: '8px'
	// 						}}
	// 					>
	// 						{t('registration.topic.summary')}
	// 					</Typography>
	// 					<Typography
	// 						sx={{ mb: hasAgencyError ? '24px' : '0px' }}
	// 					>
	// 						<>
	// 							<ReportProblemIcon
	// 								aria-hidden="true"
	// 								color="inherit"
	// 								sx={{
	// 									width: '20px',
	// 									height: '20px',
	// 									mr: '8px',
	// 									color: '#FF9F00'
	// 								}}
	// 							/>
	// 							{t('registration.errors.tid')}
	// 						</>
	// 					</Typography>
	// 				</>
	// 			)}
	// 			{hasAgencyError && (
	// 				<>
	// 					<Typography
	// 						sx={{
	// 							fontWeight: '600',
	// 							mb: '8px'
	// 						}}
	// 					>
	// 						{t('registration.agency.summary')}
	// 					</Typography>

	// 					<Typography>
	// 						<ReportProblemIcon
	// 							aria-hidden="true"
	// 							color="inherit"
	// 							sx={{
	// 								width: '20px',
	// 								height: '20px',
	// 								mr: '8px',
	// 								color: '#FF9F00'
	// 							}}
	// 						/>
	// 						{t('registration.errors.aid')}
	// 					</Typography>
	// 				</>
	// 			)}
	// 		</Box>
	// 	);
	// }

	if (preselectedData.length === 0 && !isConsultantLink) {
		return null;
	}

	return (
		<>
			<Box
				sx={{
					display: {
						xs: 'none',
						md: 'block'
					},
					p: '16px',
					my: '32px',
					borderRadius: '4px',
					border: '1px solid #c6c5c4'
				}}
			>
				{isConsultantLink && (
					<Typography> {t('registration.consultantlink')}</Typography>
				)}
				{(preselectedTopicName || hasTopicError) &&
					!isConsultantLink && (
						<>
							<Typography sx={{ fontWeight: '600', mb: '8px' }}>
								{t('registration.topic.summary')}
							</Typography>
							{hasTopicError && !preselectedTopicName ? (
								<Typography
									sx={{ mb: hasAgencyError ? '16px' : '0px' }}
								>
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
								<Typography
									sx={{
										mb:
											preselectedAgency || hasAgencyError
												? '16px'
												: '0px'
									}}
								>
									{preselectedTopicName}
								</Typography>
							)}
						</>
					)}
				{(preselectedAgency || hasAgencyError) && !isConsultantLink && (
					<>
						<Typography
							sx={{
								fontWeight: '600',
								mb: '8px'
							}}
						>
							{t('registration.agency.summary')}
						</Typography>
						{hasAgencyError && !preselectedAgency ? (
							<Typography>
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
									{t('registration.errors.aid')}
								</>
							</Typography>
						) : (
							<Typography>{preselectedAgency?.name}</Typography>
						)}
					</>
				)}
			</Box>
			{hasDrawer && (
				<PreselectedDataDrawer
					topicName={topicName}
					agencyName={agencyName}
					isConsultantLink={isConsultantLink}
				/>
			)}
		</>
	);
};
