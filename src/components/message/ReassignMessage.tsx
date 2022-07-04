import React from 'react';
import { translate } from '../../utils/translate';

import './reassignRequestMessage.styles';
import { Button, BUTTON_TYPES } from '../button/Button';

export const ReassignRequestMessage: React.FC<{
	oldConsultantName: string;
	newConsultantName: string;
	onClick: (accepted: boolean) => void;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.title',
						{
							oldConsultant: props.oldConsultantName,
							newConsultant: props.newConsultantName
						}
					)}
				</h5>

				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.description',
						{
							oldConsultant: props.oldConsultantName,
							newConsultant: props.newConsultantName
						}
					)}
				</span>
				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.question'
					)}
				</span>
				<div className="buttons">
					<Button
						item={{
							label: translate(
								'session.reassign.system.message.reassign.accept'
							),
							type: BUTTON_TYPES.PRIMARY
						}}
						buttonHandle={() => props.onClick(true)}
					/>
					<Button
						item={{
							label: translate(
								'session.reassign.system.message.reassign.decline'
							),
							type: BUTTON_TYPES.SECONDARY
						}}
						buttonHandle={() => props.onClick(false)}
					/>
				</div>
			</div>
		</div>
	);
};

export const ReassignRequestSentMessage: React.FC<{
	clientName: string;
	oldConsultantName: string;
	newConsultantName: string;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate('reassign.system.message.reassign.sent.title')}
				</h5>
				<span className="description">
					{translate(
						'reassign.system.message.reassign.sent.description',
						{
							client: props.clientName,
							newConsultant: props.newConsultantName
						}
					)}
				</span>
			</div>
		</div>
	);
};

export const ReassignRequestAcceptedMessage: React.FC<{
	clientName: string;
	newConsultantName: string;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.accepted.title',
						{
							client: props.clientName
						}
					)}
				</h5>
				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.accepted.description',
						{
							client: props.clientName,
							newConsultant: props.newConsultantName
						}
					)}
				</span>
			</div>
		</div>
	);
};

export const ReassignRequestDeclinedMessage: React.FC<{
	clientName: string;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.declined.title',
						{
							client: props.clientName
						}
					)}
				</h5>
				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.declined.description',
						{
							client: props.clientName
						}
					)}
				</span>
			</div>
		</div>
	);
};
