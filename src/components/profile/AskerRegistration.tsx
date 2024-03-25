import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	UserDataContext,
	ConsultingTypesContext,
	AgencyDataInterface
} from '../../globalState';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	topicsSelectOptionsSet,
	getConsultingTypesForRegistrationStatus,
	REGISTRATION_STATUS_KEYS
} from './profileHelpers';
import { apiRegistrationNewConsultingTypes } from '../../api';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { logout } from '../logout/logout';
import { mobileListView } from '../app/navigationHandler';
import { AgencySelection } from '../agencySelection/AgencySelection';
import './profile.styles';
import { Text, LABEL_TYPES } from '../text/Text';
import { Headline } from '../headline/Headline';
import { AskerRegistrationExternalAgencyOverlay } from './AskerRegistrationExternalAgencyOverlay';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { TopicsContext } from '../../globalState';
import { TopicsDataInterface } from '../../globalState';

export const AskerRegistration: React.FC = () => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const history = useHistory();

	const { userData, reloadUserData } = useContext(UserDataContext);
	const { topics } = useContext(TopicsContext);
	const { consultingTypes, getConsultingType } = useContext(
		ConsultingTypesContext
	);
	//const consultingTypes = useConsultingTypes();
	//const selectedConsultingType = useConsultingType(selectedConsultingTypeId);

	const [selectedTopicOption, setSelectedTopicOption] = useState();
	const [topic, setTopic] = useState<TopicsDataInterface>();
	const [agency, setAgency] = useState<AgencyDataInterface>();
	const consultingType = useMemo(
		() => (topic ? getConsultingType(topic.id) : undefined),
		[getConsultingType, topic]
	);

	//const [selectedConsultingTypeId, setSelectedConsultingTypeId] = useState<number>(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [successOverlayActive, setSuccessOverlayActive] = useState(false);
	const [successOverlayItem, setSuccessOverlayItem] =
		useState<OverlayItem>(null);
	const [externalAgencyOverlayActive, setExternalAgencyOverlayActive] =
		useState(false);
	const [sessionId, setSessionId] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const buttonSetRegistration: ButtonItem = {
		label: translate('profile.data.register.button.label'),
		type: BUTTON_TYPES.LINK
	};

	const overlayItemNewRegistrationSuccess: OverlayItem = {
		svg: CheckIcon,
		headline: translate('profile.data.registerSuccess.overlay.headline'),
		buttonSet: [
			{
				label: translate(
					'profile.data.registerSuccess.overlay.button1.label'
				),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate(
					'profile.data.registerSuccess.overlay.button2.label'
				),
				function: OVERLAY_FUNCTIONS.LOGOUT,
				type: BUTTON_TYPES.LINK
			}
		]
	};

	const overlayItemNewRegistrationError: OverlayItem = {
		svg: XIcon,
		illustrationBackground: 'error',
		headline: translate('profile.data.registerError.overlay.headline'),
		buttonSet: [
			{
				label: translate(
					'profile.data.registerError.overlay.button.label'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const isAllRequiredDataSet = useMemo(
		() => topic && agency,
		[agency, topic]
	);

	useEffect(() => {
		setIsButtonDisabled(!isAllRequiredDataSet);
	}, [isAllRequiredDataSet]);

	const translatedTopics = useMemo(
		() =>
			userData
				? topicsSelectOptionsSet(userData, consultingTypes, topics).map(
						(option) => ({
							...option,
							label: translate(
								[
									`topic.${option.value}.titles.registrationDropdown`,
									// ToDo: Fallback for old translations of consultingTypes
									`selectedTopicOption.${option.value}.titles.registrationDropdown`,
									option.label as string
								],
								{ ns: ['topics', 'consultingTypes'] }
							)
						})
				  )
				: [],
		[consultingTypes, topics, translate, userData]
	);

	const topicsDropdown: SelectDropdownItem = useMemo(
		() => ({
			id: 'topicSelect',
			selectedOptions: translatedTopics,
			handleDropdownSelect: setSelectedTopicOption,
			selectInputLabel: translate(
				'profile.data.register.consultingTypeSelect.label'
			),
			useIconOption: false,
			isSearchable: false,
			menuPlacement: 'bottom',
			defaultValue: selectedTopicOption
		}),
		[selectedTopicOption, translate, translatedTopics]
	);

	const handleRegistration = () => {
		if (isRequestInProgress) {
			return null;
		}

		if (isAllRequiredDataSet) {
			if (agency.external) {
				if (!agency.url) {
					console.error(
						`External agency with id ${agency.id} doesn't have a url set.`
					);
					return;
				}
				setExternalAgencyOverlayActive(true);
				return;
			}

			setIsRequestInProgress(true);

			apiRegistrationNewConsultingTypes(
				topic.id,
				agency.id,
				agency.postcode
			)
				.then((response) => {
					let overlayItem = overlayItemNewRegistrationSuccess;
					if (consultingType?.groupChat.isGroupChat) {
						overlayItem.buttonSet[0].label = translate(
							'profile.data.registerSuccess.overlay.groupChats.button.label.'
						);
					} else {
						setSessionId(response.sessionId);
					}
					setSuccessOverlayItem(overlayItem);
					setSuccessOverlayActive(true);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setSuccessOverlayItem(overlayItemNewRegistrationError);
					setSuccessOverlayActive(true);
					setIsRequestInProgress(false);
				});
		}
	};

	const handleSuccessOverlayAction = (buttonFunction: string) => {
		reloadUserData().catch(console.log);

		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			mobileListView();
			if (!sessionId) {
				history.push({
					pathname: `/sessions/user/view`
				});
				return;
			}

			history.push({
				pathname: `/sessions/user/view/write/${sessionId}`
			});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setSuccessOverlayItem({});
			setSuccessOverlayActive(false);
			setTopic(undefined);
		} else {
			logout();
		}
	};

	const handleExternalAgencyOverlayAction = () => {
		setExternalAgencyOverlayActive(false);
	};

	/**
	 * @deprecated This function is deprecated and should be replaced with topic logic.
	 * Currently it works because it consultingTypeId equals topics
	 */
	const isOnlyRegisteredForGroupChats = useMemo(() => {
		const registeredTopicIds =
			userData &&
			getConsultingTypesForRegistrationStatus(
				userData,
				REGISTRATION_STATUS_KEYS.REGISTERED
			);

		return (
			registeredTopicIds &&
			consultingTypes.find((cur) =>
				registeredTopicIds
					.map((ct) => ct.consultingTypeId)
					.includes(cur.id)
			)?.groupChat.isGroupChat &&
			consultingType &&
			!consultingType.groupChat.isGroupChat
		);
	}, [consultingTypes, consultingType, userData]);

	return (
		<div className="profile__data__itemWrapper askerRegistration">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.register.headline')}
					semanticLevel="5"
				/>
			</div>
			<div className="askerRegistration__consultingTypeWrapper">
				<SelectDropdown {...topicsDropdown} />
				{isOnlyRegisteredForGroupChats && (
					<Text
						className="askerRegistration__consultingModeInfo"
						labelType={LABEL_TYPES.NOTICE}
						text={translate(
							'profile.data.register.consultingModeInfo.singleChats'
						)}
						type="infoSmall"
					/>
				)}
			</div>

			{topic && (
				<AgencySelection
					topic={topic}
					onAgencyChange={setAgency}
					isProfileView={true}
					agencySelectionNote={
						consultingType?.registration?.notes?.agencySelection
					}
				/>
			)}
			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
			{successOverlayActive && (
				<Overlay
					item={successOverlayItem}
					handleOverlay={handleSuccessOverlayAction}
				/>
			)}
			{externalAgencyOverlayActive && (
				<AskerRegistrationExternalAgencyOverlay
					selectedAgency={agency}
					topic={topic}
					handleOverlayAction={handleExternalAgencyOverlayAction}
				/>
			)}
		</div>
	);
};
