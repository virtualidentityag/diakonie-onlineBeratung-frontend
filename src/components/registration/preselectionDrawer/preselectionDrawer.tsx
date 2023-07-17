import * as React from 'react';
import { useContext, useState, VFC, useEffect } from 'react';
import { Box, Drawer, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../app/Loading';
import { RegistrationContext } from '../../../globalState';
import { PreselectionError } from '../preselectionError/PreselectionError';

export const PreselectionDrawer: VFC<{
	topicName: string;
	agencyName: string;
}> = ({ topicName, agencyName }) => {
	const {
		hasTopicError,
		hasAgencyError,
		hasConsultantError,
		isConsultantLink
	} = useContext(RegistrationContext);
	const { t } = useTranslation();
	const [loading, isLoading] = useState<boolean>(true);
	const [isOverlayDrawerOpen, setIsOverlayDrawerOpen] =
		useState<boolean>(true);

	setTimeout(() => {
		isLoading(false);
	}, 3000);

	return (
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
					minHeight: '100vh',
					backgroundColor: 'primary.dark',
					p: '24px'
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '40vh'
					}}
				>
					{loading && <Loading />}
				</Box>

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
							hasConsultantError ? (
								<PreselectionError
									errorMessage={t('registration.errors.cid')}
								></PreselectionError>
							) : (
								<Typography
									sx={{
										color: 'white',
										mt: '24px'
									}}
								>
									{t('registration.consultantlink')}
								</Typography>
							)
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
								{hasTopicError ? (
									<PreselectionError
										errorMessage={t(
											'registration.errors.tid'
										)}
									></PreselectionError>
								) : (
									<Typography
										sx={{ color: 'white', mt: '8px' }}
									>
										{topicName}
									</Typography>
								)}
								<Typography
									sx={{
										color: 'white',
										fontWeight: '600',
										mt: '16px'
									}}
								>
									{t('registration.agency.summary')}
								</Typography>
								{hasAgencyError ? (
									<PreselectionError
										errorMessage={t(
											'registration.errors.aid'
										)}
									></PreselectionError>
								) : (
									<Typography
										sx={{ color: 'white', mt: '8px' }}
									>
										{agencyName}
									</Typography>
								)}
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
	);
};
