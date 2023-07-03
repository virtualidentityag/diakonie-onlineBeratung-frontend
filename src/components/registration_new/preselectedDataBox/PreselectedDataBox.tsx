import * as React from 'react';
import { useContext, useState, useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, Typography, Button } from '@mui/material';
import { RegistrationContext } from '../../../globalState';
import { ReactComponent as Loader } from './loader.svg';
import { ReactComponent as Logo } from './logo.svg';

export const PreselectedDataBox: VFC<{
	hasDrawer: boolean;
}> = ({ hasDrawer = false }) => {
	const { preselectedAgencyName, preselectedTopicName, isConsultantLink } =
		useContext(RegistrationContext);
	const { t } = useTranslation();
	const [loading, isLoading] = useState<boolean>(true);
	const [topicName, setTopicName] = useState('-');
	const [agencyName, setAgencyName] = useState('-');
	const [isOverlayDrawerOpen, setIsOverlayDrawerOpen] =
		useState<boolean>(true);
	useEffect(() => {
		if (preselectedTopicName) {
			setTopicName(preselectedTopicName);
		}
		if (preselectedAgencyName) {
			setAgencyName(preselectedAgencyName);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedAgencyName, preselectedTopicName]);

	setTimeout(() => {
		isLoading(false);
	}, 3000);

	if (!preselectedAgencyName && !preselectedTopicName && !isConsultantLink) {
		return null;
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
			{/* TODO: Adapt drawer to normal styling and move this to extensions */}
			{hasDrawer && (
				<Drawer
					anchor="left"
					open={isOverlayDrawerOpen}
					sx={{
						'display': { md: 'none' },
						'width': '100vw',
						'height': '100vh',
						'zIndex': (theme) => theme.zIndex.drawer + 2,
						'> .MuiPaper-root': {
							top: 0,
							height: '100vh',
							overflow: 'scroll'
						}
					}}
				>
					<Box
						sx={{
							width: '100vw',
							height: '30vh',
							backgroundColor: 'primary.main',
							p: '24px'
						}}
					>
						<Logo
							className="stage__logo"
							aria-label={t('app.stage.title')}
						/>
					</Box>
					<Box
						sx={{
							width: '100vw',
							minHeight: '70vh',
							backgroundColor: 'primary.dark',
							p: '24px'
						}}
					>
						<Typography
							variant="h2"
							sx={{ color: 'white', fontWeight: '600' }}
						>
							{t('app.stage.title')}
						</Typography>
						<Typography
							variant="h4"
							sx={{
								color: 'white',
								mt: '8px',
								fontWeight: '400'
							}}
						>
							{t('app.claim')}
						</Typography>

						{loading && (
							<Box
								sx={{
									'display': 'flex',
									'justifyContent': 'center',
									'& svg': {
										'width': '70%',
										'animationName': 'loading',
										'animationDuration': '2s',
										'animationDelay': '0.3s',
										'animationFillMode': 'both',
										'@keyframes loading': {
											'0%': {
												width: '60%'
											},
											'35%': {
												width: '70%'
											},
											'70%': {
												width: '60%',
												opacity: '1'
											},
											'100%': {
												opacity: '0'
											}
										}
									}
								}}
							>
								<Loader />
							</Box>
						)}
						{!loading && (
							<Box
								sx={{
									'animationName': 'fadeIn',
									'animationDuration': '0.3s',
									'animationFillMode': 'forward',
									'@keyframes fadeIn': {
										'0%': {
											opacity: 0
										},
										'100%': {
											opacity: 1
										}
									}
								}}
							>
								{isConsultantLink ? (
									<Typography
										sx={{
											color: 'white',
											mt: '24px'
										}}
									>
										{' '}
										{t('registration.consultantlink')}
									</Typography>
								) : (
									<>
										<Typography
											sx={{
												color: 'white',
												fontWeight: '600',
												mt: '24px'
											}}
										>
											{t('registration.topic.summary')}
										</Typography>
										<Typography
											sx={{ color: 'white', mt: '8px' }}
										>
											{topicName}
										</Typography>
										<Typography
											sx={{
												color: 'white',
												fontWeight: '600',
												mt: '16px'
											}}
										>
											{t('registration.agency.summary')}
										</Typography>
										<Typography
											sx={{ color: 'white', mt: '8px' }}
										>
											{agencyName}
										</Typography>
									</>
								)}
								<Button
									sx={{
										mt: {
											xs: '8px',
											md: '16px'
										},
										ml: 'auto',
										mr: '0',
										backgroundColor: 'white',
										position: 'absolute',
										bottom: '24px',
										right: '24px'
									}}
									variant="outlined"
									onClick={() => {
										setIsOverlayDrawerOpen(false);
									}}
								>
									{t('app.next')}
								</Button>
							</Box>
						)}
					</Box>
				</Drawer>
			)}
		</>
	);
};
