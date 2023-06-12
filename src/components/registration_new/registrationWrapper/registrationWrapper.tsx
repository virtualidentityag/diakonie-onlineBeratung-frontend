import { Typography, Link, Button, Box } from '@mui/material';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Stage } from '../../stage/stage';
import { StageLayout } from '../../stageLayout/StageLayout';
import useIsFirstVisit from '../../../utils/useIsFirstVisit';
import { StepBar } from '../stepBar/StepBar';
import { AccountData } from '../accountData/accountData';
import { ZipcodeInput } from '../zipcodeInput/zipcodeInput';
import { AgencySelection } from '../agencySelection/agencySelection';
import { TopicSelection } from '../topicSelection/topicSelection';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { WelcomeScreen } from '../welcomeScreen/welcomeScreen';
import { RegistrationContext } from '../../../globalState';

export const RegistrationWrapper = () => {
	const isFirstVisit = useIsFirstVisit();
	const { disabledNextButton, setDisabledNextButton, dataForSessionStorage } =
		useContext(RegistrationContext);
	const [isReady, setIsReady] = useState(false);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const location = useLocation();
	const history = useHistory();
	const { t: translate } = useTranslation();
	// TODO: Needs to be adapted to available steps of topic
	const stepDefinition = {
		0: { component: 'welcome', urlSuffix: '' },
		1: {
			component: 'topicSelection',
			urlSuffix: '/topic-selection',
			mandatoryFields: ['topicId']
		},
		2: {
			component: 'zipcode',
			urlSuffix: '/zipcode',
			mandatoryFields: ['zipcode']
		},
		3: {
			component: 'agencySelection',
			urlSuffix: '/agency-selection',
			mandatoryFields: ['agencyId']
		},
		4: {
			component: 'accountData',
			urlSuffix: '/account-data',
			mandatoryFields: ['username', 'password']
		}
	};
	const getCurrentStep = () => {
		const currentLocation =
			window.location.href.split('?')[0].split('/registration')[1] || '';
		const step =
			Object.keys(stepDefinition).filter(
				(step) =>
					stepDefinition[step || 0].urlSuffix === currentLocation
			)[0] || '0';
		setCurrentStep(parseInt(step, 10));
	};

	const checkMissingSteps = () => {
		if (currentStep > 0) {
			return Object.keys(stepDefinition).filter((step) => {
				const registrationData =
					sessionStorage.getItem('registrationData') || '{}';
				return stepDefinition[step]?.mandatoryFields?.every(
					(mandatoryField) =>
						JSON.parse(registrationData)?.[mandatoryField] ===
						undefined
				);
			});
		}
		return [];
	};

	useEffect(() => {
		setDisabledNextButton(true);
		getCurrentStep();
	}, [location]);

	useEffect(() => {
		// Check if mandatory fields from previous steps are missing
		const missingPreviousSteps = checkMissingSteps()
			.sort()
			.filter((missingStep) => parseInt(missingStep, 10) < currentStep);
		if (missingPreviousSteps.length > 0) {
			history.push(
				`/registration${
					stepDefinition[missingPreviousSteps[0]].urlSuffix
				}`
			);
		}
	}, [currentStep]);

	return (
		<>
			<StageLayout
				showLegalLinks={false}
				showLoginLink={true}
				stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
			>
				<Box sx={{ pb: '96px' }}>
					{stepDefinition[currentStep].component !== 'welcome' && (
						<>
							<Typography
								sx={{ mb: '24px' }}
								component="h1"
								variant="h2"
							>
								{translate('registration.headline')}
							</Typography>
							<StepBar
								maxNumberOfSteps={4}
								currentStep={currentStep}
							></StepBar>
						</>
					)}
					{stepDefinition[currentStep].component === 'welcome' && (
						<WelcomeScreen
							nextStepUrl={`/registration${
								stepDefinition[currentStep + 1].urlSuffix
							}`}
						></WelcomeScreen>
					)}
					{stepDefinition[currentStep].component ===
						'topicSelection' && <TopicSelection></TopicSelection>}
					{stepDefinition[currentStep].component === 'zipcode' && (
						<ZipcodeInput></ZipcodeInput>
					)}
					{stepDefinition[currentStep].component ===
						'agencySelection' && (
						<AgencySelection></AgencySelection>
					)}
					{stepDefinition[currentStep].component ===
						'accountData' && <AccountData></AccountData>}

					{stepDefinition[currentStep].component !== 'welcome' && (
						<Box
							sx={{
								height: '96px',
								position: 'fixed',
								bottom: '0',
								right: '0',
								px: {
									xs: '16px',
									md: 'calc((100vw - 550px) / 2)',
									lg: '0'
								},
								width: { xs: '100vw', lg: '60vw' },
								backgroundColor: 'white',
								borderTop: '1px solid #c6c5c4',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Box
								sx={{
									maxWidth: { xs: '600px', lg: '700px' },
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									width: {
										xs: '100%',
										lg: 'calc(60vw - 300px)'
									}
								}}
							>
								{currentStep > 0 && (
									<Link
										sx={{
											textDecoration: 'none',
											color: 'info.light'
										}}
										component={RouterLink}
										to={`/registration${
											stepDefinition[currentStep - 1]
												.urlSuffix
										}`}
									>
										{translate('registration.back')}
									</Link>
								)}
								{currentStep ===
								Object.keys(stepDefinition).length - 1 ? (
									<Button
										disabled={disabledNextButton}
										variant="contained"
										onClick={() => {
											// TODO: Check if username is available, use data from sessionStorage & last step to trigger registration
										}}
									>
										{translate('registration.register')}
									</Button>
								) : (
									<Button
										disabled={disabledNextButton}
										sx={{ width: 'unset' }}
										variant="contained"
										component={RouterLink}
										to={`/registration${
											stepDefinition[currentStep + 1]
												.urlSuffix
										}`}
										onClick={() => {
											const existingRegistrationData =
												sessionStorage.getItem(
													'registrationData'
												);
											console.log(
												existingRegistrationData
											);
											sessionStorage.setItem(
												'registrationData',
												JSON.stringify({
													...(existingRegistrationData
														? JSON.parse(
																existingRegistrationData
														  )
														: null),
													...dataForSessionStorage
												})
											);
										}}
									>
										{translate('registration.next')}
									</Button>
								)}
							</Box>
						</Box>
					)}
				</Box>
			</StageLayout>
		</>
	);
};
