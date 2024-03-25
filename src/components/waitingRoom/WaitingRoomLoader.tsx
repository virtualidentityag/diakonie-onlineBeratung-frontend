import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiAgencySelection, apiGetConsultingType } from '../../api';
import { WaitingRoom } from '../waitingRoom/WaitingRoom';
import { apiGetTopicById } from '../../api/apiGetTopicId';
import {
	ConsultingTypeInterface,
	ConsultingTypesContext,
	TopicsContext,
	TopicsDataInterface
} from '../../globalState';
import { DEFAULT_POSTCODE } from '../registration/prefillPostcode';

export interface WaitingRoomLoaderProps {
	handleUnmatch: () => void;
	onAnonymousRegistration: Function;
}

export const WaitingRoomLoader = ({
	handleUnmatch,
	onAnonymousRegistration
}: WaitingRoomLoaderProps) => {
	const { topicSlug } = useParams<{ topicSlug: string }>();

	const { getConsultingTypeFull } = useContext(ConsultingTypesContext);
	const { getTopicBySlugNameOrId } = useContext(TopicsContext);

	const [topic, setTopic] = useState<TopicsDataInterface>();
	const [consultingType, setConsultingType] =
		useState<ConsultingTypeInterface>();

	useEffect(() => {
		(async () => {
			const topic = await getTopicBySlugNameOrId(topicSlug);
			const consultingType = await getConsultingTypeFull(topic.id);
			if (consultingType?.isAnonymousConversationAllowed) {
				setTopic(topic);
				setConsultingType(consultingType);
			} else {
				handleUnmatch();
			}
		})();
	}, [
		topicSlug,
		handleUnmatch,
		getTopicBySlugNameOrId,
		getConsultingTypeFull
	]);

	if (!consultingType?.isAnonymousConversationAllowed) {
		return null;
	}

	return (
		<WaitingRoom
			topic={topic}
			onAnonymousRegistration={onAnonymousRegistration}
		/>
	);
};
