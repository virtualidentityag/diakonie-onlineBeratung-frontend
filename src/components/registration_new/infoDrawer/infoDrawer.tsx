import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { Global } from '@emotion/react';
import { RegistrationContext } from '../../../globalState';

interface InfoDrawerProps {
	trigger?: boolean;
}

export const InfoDrawer = ({ trigger }: InfoDrawerProps) => {
	const { preselectedAgency, preselectedTopicName } =
		useContext(RegistrationContext);
	const { t } = useTranslation();
	const drawerBleeding = 92;
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [topicName, setTopicName] = useState('-');
	const [agencyName, setAgencyName] = useState('-');
	const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event?.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setIsDrawerOpen(!isDrawerOpen);
	};

	useEffect(() => {
		if (preselectedTopicName) {
			setTopicName(preselectedTopicName);
		}
		if (preselectedAgency) {
			setAgencyName(preselectedAgency.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedAgency, preselectedTopicName]);

	return (
		<>
			<Global
				styles={{
					'.MuiDrawer-root > .MuiPaper-root': {
						top: -drawerBleeding,
						overflow: 'visible'
					}
				}}
			/>
			<SwipeableDrawer
				sx={{
					display: { md: 'none' },
					top: 0
				}}
				hideBackdrop={true}
				anchor="top"
				onClose={() => setIsDrawerOpen(false)}
				onOpen={() => setIsDrawerOpen(true)}
				open={isDrawerOpen}
				ModalProps={{
					keepMounted: true
				}}
			>
				<Box
					onClick={toggleDrawer}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							toggleDrawer(e);
						}
					}}
					tabIndex={0}
					sx={{
						'px': '16px',
						'pt': '16px',
						'mt': trigger ? 0 : '48px',
						'position': 'relative',
						'borderBottomLeftRadius': 8,
						'borderBottomRightRadius': 8,
						'visibility': 'visible',
						'right': 0,
						'left': 0,
						'width': '100vw',
						'backgroundColor': 'primary.main',
						'color': 'white',
						'animationName': 'slideIn',
						'animationDuration': '0.8s',
						'animationDelay': '0.3s',
						'animationFillMode': 'forwards',
						'@keyframes slideIn': {
							'0%': {
								top: 0
							},
							'100%': {
								top: drawerBleeding
							}
						}
					}}
				>
					<Box sx={{ opacity: isDrawerOpen ? 1 : 0 }}>
						<Typography sx={{ color: 'white', fontWeight: '600' }}>
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
					</Box>
					<Box
						onClick={toggleDrawer}
						sx={{
							pt: '10px',
							pb: '10px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							pointerEvents: 'all',
							cursor: 'pointer'
						}}
					>
						{isDrawerOpen ? (
							<KeyboardArrowUpIcon
								sx={{ height: '24px', width: '24px' }}
							/>
						) : (
							<KeyboardArrowDownIcon
								sx={{ height: '24px', width: '24px' }}
							/>
						)}
					</Box>
				</Box>
			</SwipeableDrawer>
		</>
	);
};
