import { Box, Typography, Button } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CreateIcon from '@mui/icons-material/Create';
import ChatIcon from '@mui/icons-material/Chat';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import { Link as RouterLink } from 'react-router-dom';

interface WelcomeScreenProps {
	nextStepUrl: string;
}

export const WelcomeScreen = ({ nextStepUrl }: WelcomeScreenProps) => {
	const { t: translate } = useTranslation();

	const infoDefinitions = [
		{
			icon: (
				<CreateIcon
					aria-hidden="true"
					focusable="false"
					sx={{ width: '30px', height: '30px' }}
					color="primary"
				></CreateIcon>
			),
			headline: translate('registration.welcomeScreen.info1.title'),
			subline: translate('registration.welcomeScreen.info1.text')
		},
		{
			icon: (
				<ChatIcon
					sx={{ width: '30px', height: '30px' }}
					color="primary"
				></ChatIcon>
			),
			headline: translate('registration.welcomeScreen.info2.title'),
			subline: translate('registration.welcomeScreen.info2.text')
		},
		{
			icon: (
				<MailIcon
					sx={{ width: '30px', height: '30px' }}
					color="primary"
				></MailIcon>
			),
			headline: translate('registration.welcomeScreen.info3.title'),
			subline: translate('registration.welcomeScreen.info3.text')
		},
		{
			icon: (
				<LockIcon
					sx={{ width: '30px', height: '30px' }}
					color="primary"
				></LockIcon>
			),
			headline: translate('registration.welcomeScreen.info4.title'),
			subline: translate('registration.welcomeScreen.info4.text')
		}
	];
	return (
		<>
			<Typography variant="h2">
				{translate('registration.overline')}
			</Typography>
			<Typography variant="subtitle1" sx={{ mt: '12px', mb: '48px' }}>
				{translate('registration.welcomeScreen.subline')}
			</Typography>
			{infoDefinitions.map((info) => (
				<Box sx={{ display: 'flex', alignItems: 'center', mb: '32px' }}>
					{info.icon}
					<Box sx={{ ml: '24px' }}>
						<Typography variant="h5">{info.headline}</Typography>
						<Typography variant="body1" sx={{ mt: '4px' }}>
							{info.subline}
						</Typography>
					</Box>
				</Box>
			))}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					p: '32px',
					mt: '48px',
					borderRadius: '4px',
					border: '1px solid #c6c5c4'
				}}
			>
				<Box sx={{ mr: '24px', width: '50%' }}>
					<Typography
						variant="body2"
						sx={{ textAlign: 'center', fontWeight: '600' }}
					>
						{translate(
							'registration.welcomeScreen.register.helperText'
						)}
					</Typography>
					<Button
						fullWidth
						sx={{ mt: '16px' }}
						variant="contained"
						component={RouterLink}
						to={nextStepUrl}
					>
						{translate(
							'registration.welcomeScreen.register.buttonLabel'
						)}
					</Button>
				</Box>
				<Box sx={{ width: '50%' }}>
					<Typography
						variant="body2"
						sx={{ textAlign: 'center', fontWeight: '600' }}
					>
						{translate(
							'registration.welcomeScreen.login.helperText'
						)}
					</Typography>
					<Button
						fullWidth
						sx={{ mt: '16px' }}
						variant="outlined"
						component={RouterLink}
						to={`/login`}
					>
						{translate(
							'registration.welcomeScreen.login.buttonLabel'
						)}
					</Button>
				</Box>
			</Box>
		</>
	);
};
