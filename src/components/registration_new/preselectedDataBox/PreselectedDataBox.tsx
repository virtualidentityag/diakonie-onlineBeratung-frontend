import * as React from 'react';
import { useContext, useState, useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { RegistrationContext } from '../../../globalState';
import { PreselectedDataDrawer } from '../preselectedDataDrawer/PreselectedDataDrawer';
import CloseIcon from '@mui/icons-material/Close';

export const PreselectedDataBox: VFC<{
	hasDrawer?: boolean;
	showErrors?: boolean;
}> = ({ hasDrawer = false, showErrors = false }) => {
	const {
		preselectedAgencyName,
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
		if (preselectedAgencyName) {
			setAgencyName(preselectedAgencyName);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedAgencyName, preselectedTopicName]);

	if (preselectedData.length === 0 && !isConsultantLink) {
		return null;
	}

	if ((hasConsultantError || hasTopicError || hasAgencyError) && showErrors) {
		return (
			<Box
				sx={{
					'display': {
						xs: 'none',
						md: 'block'
					},
					'gridTemplateColumns': 'auto 1fr',
					'gridColumnGap': '24px',
					'gridRowGap': '16px',
					'p': '16px',
					'my': '32px',
					'borderRadius': '4px',
					'border': '1px solid #c6c5c4',
					'& p:not(:last-child)': {
						mb: '24px'
					}
				}}
			>
				{hasConsultantError && (
					<Typography sx={{ display: 'flex', alignItems: 'center' }}>
						<Box
							sx={{
								mr: '8px',
								backgroundColor: 'error.main',
								borderRadius: '50%',
								p: '4px',
								maxHeight: '24px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<CloseIcon
								aria-hidden="true"
								color="inherit"
								sx={{ width: '16px', height: '16px' }}
							/>
						</Box>
						{t('registration.errors.cid.headline')}
					</Typography>
				)}
				{hasAgencyError && (
					<Typography sx={{ display: 'flex', alignItems: 'center' }}>
						<Box
							sx={{
								mr: '8px',
								backgroundColor: 'error.main',
								borderRadius: '50%',
								p: '4px',
								maxHeight: '24px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<CloseIcon
								aria-hidden="true"
								color="inherit"
								sx={{ width: '16px', height: '16px' }}
							/>
						</Box>
						{t('registration.errors.aid.headline')}
					</Typography>
				)}
				{hasTopicError && (
					<Typography sx={{ display: 'flex', alignItems: 'center' }}>
						<Box
							sx={{
								mr: '8px',
								backgroundColor: 'error.main',
								borderRadius: '50%',
								p: '4px',
								maxHeight: '24px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<CloseIcon
								aria-hidden="true"
								color="inherit"
								sx={{ width: '16px', height: '16px' }}
							/>
						</Box>
						{t('registration.errors.tid.headline')}
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<>
			<Box
				sx={{
					display: {
						xs: 'none',
						md: isConsultantLink ? 'block' : 'grid'
					},
					gridTemplateColumns: 'auto 1fr',
					gridColumnGap: '24px',
					gridRowGap: '16px',
					p: '16px',
					my: '32px',
					borderRadius: '4px',
					border: '1px solid #c6c5c4'
				}}
			>
				{isConsultantLink && (
					<Typography> {t('registration.consultantlink')}</Typography>
				)}
				{preselectedTopicName && !isConsultantLink && (
					<>
						<Typography sx={{ fontWeight: '600' }}>
							{t('registration.topic.summary')}
						</Typography>
						<Typography>{preselectedTopicName}</Typography>
					</>
				)}
				{preselectedAgencyName && !isConsultantLink && (
					<>
						<Typography
							sx={{
								fontWeight: '600'
							}}
						>
							{t('registration.agency.summary')}
						</Typography>
						<Typography>{preselectedAgencyName}</Typography>
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
