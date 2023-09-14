import * as React from 'react';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as ArrowIcon } from '../../resources/img/illustrations/arrow.svg';
import { BUTTON_TYPES } from '../button/Button';
import { useTranslation } from 'react-i18next';
import { TopicsDataInterface } from '../../globalState/interfaces/TopicsDataInterface';

interface AskerRegistrationExternalAgencyOverlayProps {
	topic: TopicsDataInterface;
	handleOverlayAction: (action: string) => void;
	selectedAgency: any;
}

export const AskerRegistrationExternalAgencyOverlay = ({
	topic,
	handleOverlayAction,
	selectedAgency
}: AskerRegistrationExternalAgencyOverlayProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const handleOverlay = (action) => {
		if (action === OVERLAY_FUNCTIONS.REDIRECT) {
			window.open(selectedAgency.url, '_blank')?.focus();
		} else {
			handleOverlayAction(action);
		}
	};

	return (
		<Overlay
			item={{
				svg: ArrowIcon,
				headline: translate('profile.externalRegistration.headline'),
				copy:
					translate('profile.externalRegistration.copy.start') +
					translate(
						[
							// TODO: Translate
							topic.titles.short
						],
						{ ns: 'consultingTypes' }
					) +
					translate('profile.externalRegistration.copy.end'),
				buttonSet: [
					{
						label: translate('profile.externalRegistration.submit'),
						function: OVERLAY_FUNCTIONS.REDIRECT,
						type: BUTTON_TYPES.PRIMARY
					},
					{
						label: translate('profile.externalRegistration.cancel'),
						function: OVERLAY_FUNCTIONS.CLOSE,
						type: BUTTON_TYPES.SECONDARY
					}
				]
			}}
			handleOverlay={handleOverlay}
		/>
	);
};
