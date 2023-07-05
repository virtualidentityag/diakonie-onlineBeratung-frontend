import * as React from 'react';
import { useState, VFC } from 'react';
import { Box, Drawer, Typography, Button } from '@mui/material';
import { ReactComponent as Loader } from './loader.svg';
import { ReactComponent as Logo } from './logo.svg';
import { useTranslation } from 'react-i18next';

export const PreselectedDataDrawer: VFC<{
	topicName: string;
	agencyName: string;
	isConsultantLink: boolean;
}> = ({ topicName, agencyName, isConsultantLink }) => {
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
								<Typography sx={{ color: 'white', mt: '8px' }}>
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
								<Typography sx={{ color: 'white', mt: '8px' }}>
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
	);
};
