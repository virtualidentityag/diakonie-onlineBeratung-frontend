import { Steps } from 'intro.js-react';
import * as React from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import 'intro.js/introjs.css';
import './walkthrough.styles.scss';
import { translate } from '../../utils/translate';
import { UserDataContext } from '../../globalState';
import { apiPatchConsultantData } from '../../api';
import { config } from '../../resources/scripts/config';

import stepsData from './steps';

export const Walkthrough = () => {
	const ref = React.useRef<any>();
	const { userData, setUserData } = useContext(UserDataContext);
	const history = useHistory();

	// Hacky way of refetch the elements after the page is changed
	const onChangeStep = React.useCallback(() => {
		ref.current.props.steps.forEach((step, key) => {
			if (step.element) {
				ref.current.introJs._introItems[key].element =
					document.querySelector(step.element);
				ref.current.introJs._introItems[key].position = step.position
					? step.position
					: 'bottom';
			}
		});
	}, [ref]);

	return (
		<Steps
			ref={ref}
			enabled={
				userData.isWalkThroughEnabled &&
				config.enableWalkthrough &&
				!userData.twoFactorAuth.isShown
			}
			onExit={() => {
				apiPatchConsultantData({
					walkThroughEnabled: !userData.isWalkThroughEnabled
				})
					.then(() => {
						setUserData({
							...userData,
							isWalkThroughEnabled: !userData.isWalkThroughEnabled
						});
					})
					.catch(() => {
						// don't know what to do then :O)
					});
			}}
			steps={stepsData}
			initialStep={0}
			options={{
				hidePrev: true,
				nextLabel: translate('walkthrough.step.next'),
				prevLabel: translate('walkthrough.step.prev'),
				doneLabel: translate('walkthrough.step.done'),
				showProgress: false,
				showBullets: true,
				showStepNumbers: false
			}}
			onBeforeChange={(nextStepIndex) => {
				if (stepsData[nextStepIndex].path) {
					history.push(stepsData[nextStepIndex].path);
					onChangeStep();
				}
			}}
		/>
	);
};
