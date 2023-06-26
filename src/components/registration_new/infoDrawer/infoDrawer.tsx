import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { Global } from '@emotion/react';
import { RegistrationContext } from '../../../globalState';
import { apiGetTopicsData } from '../../../api/apiGetTopicsData';
import { apiGetAgencyById } from '../../../api';

interface InfoDrawerProps {
	trigger?: boolean;
}

export const InfoDrawer = ({ trigger }: InfoDrawerProps) => {
	const { sessionStorageRegistrationData } = useContext(RegistrationContext);
	const { t } = useTranslation();
	const drawerBleeding = 92;
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [topicName, setTopicName] = useState('-');
	const [agencyName, setAgencyName] = useState('-');
	const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setIsDrawerOpen(!isDrawerOpen);
	};

	useEffect(() => {
		if (sessionStorageRegistrationData.topicId) {
			(async () => {
				try {
					const topicsResponse = await apiGetTopicsData();
					setTopicName(
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.topicId
						)[0]?.name || '-'
					);
				} catch {
					setTopicName('-');
				}
			})();
		}
		if (sessionStorageRegistrationData.agencyId) {
			(async () => {
				try {
					const agencyResponse = await apiGetAgencyById(
						sessionStorageRegistrationData.agencyId
					);
					setAgencyName(agencyResponse.name || '-');
				} catch {
					setAgencyName('-');
				}
			})();
		}
	}, [sessionStorageRegistrationData]);

	return (
		<>
			<Global
				styles={{
					'.MuiDrawer-root > .MuiPaper-root': {
						top: -drawerBleeding,
						overflow: 'visible'
						// maxHeight: '70vh'
					}
				}}
			/>
			<SwipeableDrawer
				sx={{
					display: { md: 'none' }
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
					sx={{
						'px': '16px',
						'pt': '16px',
						'mt': trigger ? 0 : '48px',
						'position': 'relative',
						'top': drawerBleeding,
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
