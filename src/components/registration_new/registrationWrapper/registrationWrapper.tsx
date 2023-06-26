import { Typography, Link, Button, Box } from '@mui/material';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StageLayout } from '../../stageLayout/StageLayout';
import useIsFirstVisit from '../../../utils/useIsFirstVisit';
import { ReactComponent as HelloBannerIcon } from '../../../resources/img/illustrations/hello-banner.svg';
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
import { Helmet } from 'react-helmet';
import { GlobalComponentContext } from '../../../globalState/provider/GlobalComponentContext';
// import { useAppConfig } from '../../../hooks/useAppConfig';
import { OVERLAY_FUNCTIONS, Overlay, OverlayItem } from '../../overlay/Overlay';
import { redirectToApp } from '../../registration/autoLogin';
import { BUTTON_TYPES } from '../../button/Button';

export const RegistrationWrapper = () => {
	// const settings = useAppConfig();
	const isFirstVisit = useIsFirstVisit();
	const { Stage } = useContext(GlobalComponentContext);
	const {
		disabledNextButton,
		setDisabledNextButton,
		dataForSessionStorage,
		setSessionStorageRegistrationData
	} = useContext(RegistrationContext);
	// const { tenant } = useContext(TenantContext);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [redirectOverlayActive, setRedirectOverlayActive] =
		useState<boolean>(false);
	const location = useLocation();
	const history = useHistory();
	const { t: translate } = useTranslation();
	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR) {
			redirectToApp();
		}
	};
	const overlayItemRegistrationSuccess: OverlayItem = {
		illustrationStyle: 'large',
		svg: HelloBannerIcon,
		headline: translate('registration.overlay.success.headline'),
		copy: translate('registration.overlay.success.copy'),
		buttonSet: [
			{
				label: translate('registration.overlay.success.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};
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

	const onNextClick = () => {
		const existingRegistrationData =
			sessionStorage.getItem('registrationData');
		sessionStorage.setItem(
			'registrationData',
			JSON.stringify({
				...(existingRegistrationData
					? JSON.parse(existingRegistrationData)
					: null),
				...dataForSessionStorage
			})
		);
	};

	useEffect(() => {
		setDisabledNextButton(true);
		getCurrentStep();
		const availableRegistrationData = JSON.parse(
			sessionStorage.getItem('registrationData')
		);
		if (availableRegistrationData) {
			setSessionStorageRegistrationData(availableRegistrationData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep]);

	return (
		<>
			<StageLayout
				showLegalLinks={false}
				showLoginLink={true}
				stage={<Stage hasAnimation={isFirstVisit} />}
			>
				<Box sx={{ pb: '96px' }}>
					{stepDefinition[currentStep].component === 'welcome' ? (
						<WelcomeScreen
							nextStepUrl={`/registration${
								stepDefinition[currentStep + 1].urlSuffix
							}`}
						></WelcomeScreen>
					) : (
						<>
							<Helmet>
								<meta name="robots" content="noindex"></meta>
							</Helmet>
							<form>
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

								{stepDefinition[currentStep].component ===
									'topicSelection' && (
									<TopicSelection
										onNextClick={onNextClick}
										nextStepUrl={`/registration${
											stepDefinition[currentStep + 1]
												.urlSuffix
										}`}
									></TopicSelection>
								)}
								{stepDefinition[currentStep].component ===
									'zipcode' && <ZipcodeInput></ZipcodeInput>}
								{stepDefinition[currentStep].component ===
									'agencySelection' && (
									<AgencySelection
										onNextClick={onNextClick}
										nextStepUrl={`/registration${
											stepDefinition[currentStep + 1]
												.urlSuffix
										}`}
									></AgencySelection>
								)}
								{stepDefinition[currentStep].component ===
									'accountData' && (
									<AccountData></AccountData>
								)}

								{stepDefinition[currentStep].component !==
									'welcome' && (
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
												maxWidth: {
													xs: '600px',
													lg: '700px'
												},
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
														stepDefinition[
															currentStep - 1
														].urlSuffix
													}`}
												>
													{translate(
														'registration.back'
													)}
												</Link>
											)}
											{currentStep ===
											Object.keys(stepDefinition).length -
												1 ? (
												<Button
													disabled={
														disabledNextButton
													}
													variant="contained"
													onClick={() => {
														const existingRegistrationData =
															sessionStorage.getItem(
																'registrationData'
															);
														const registrationData =
															{
																...(existingRegistrationData
																	? JSON.parse(
																			existingRegistrationData
																	  )
																	: null),
																...dataForSessionStorage
															};
														console.log(
															registrationData
														);
														// apiPostRegistration(
														// 	endpoints.registerAsker,
														// 	registrationData,
														// 	settings.multitenancyWithSingleDomainEnabled,
														// 	tenant
														// ).then(()=>{
														setRedirectOverlayActive(
															true
														);
														// });
													}}
												>
													{translate(
														'registration.register'
													)}
												</Button>
											) : (
												<Button
													disabled={
														disabledNextButton
													}
													sx={{ width: 'unset' }}
													variant="contained"
													component={RouterLink}
													to={`/registration${
														stepDefinition[
															currentStep + 1
														].urlSuffix
													}`}
													onClick={onNextClick}
												>
													{translate(
														'registration.next'
													)}
												</Button>
											)}
										</Box>
									</Box>
								)}
							</form>
						</>
					)}
				</Box>
			</StageLayout>
			{redirectOverlayActive && (
				<Overlay
					item={overlayItemRegistrationSuccess}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};
