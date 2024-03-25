import * as React from 'react';
import {
	createContext,
	useState,
	useContext,
	FC,
	useEffect,
	useCallback
} from 'react';
import { TopicsDataInterface } from '../interfaces';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { ConsultingTypesContext } from './ConsultingTypesProvider';

export const TopicsContext = createContext<{
	topics: TopicsDataInterface[];
	setTopics: (topics: TopicsDataInterface[]) => void;
	getTopicBySlugNameOrId: (
		slugNameOrId: string | number
	) => Promise<TopicsDataInterface | undefined>;
}>(null);

export const TopicsProvider: FC = ({ children }) => {
	const { getConsultingType } = useContext(ConsultingTypesContext);

	const [loading, setLoading] = useState(true);
	const [topics, setTopics] = useState<TopicsDataInterface[]>(null);

	useEffect(() => {
		apiGetTopicsData()
			// ToDo: extend topic by consultingType as long consulting type is not completely migrated
			.then((topics) =>
				topics.map(
					(topic) =>
						({
							...topic,
							consultingType: getConsultingType(topic.id)
						} as TopicsDataInterface)
				)
			)
			.then(setTopics)
			.finally(() => setLoading(false));
	}, [getConsultingType]);

	const getTopicBySlugNameOrId = useCallback(
		async (
			slugNameOrId: string | number
		): Promise<TopicsDataInterface | undefined> =>
			(topics || []).find(
				(topic) =>
					(typeof slugNameOrId === 'string' &&
						topic.slug === slugNameOrId) ||
					(typeof slugNameOrId === 'string' &&
						topic.name === slugNameOrId) ||
					(typeof slugNameOrId === 'number' &&
						topic.id === slugNameOrId)
			),
		[topics]
	);

	if (loading) return null;

	return (
		<TopicsContext.Provider
			value={{ topics, setTopics, getTopicBySlugNameOrId }}
		>
			{children}
		</TopicsContext.Provider>
	);
};

export function getTopic(topics: TopicsDataInterface[], id?: number) {
	if (id == null) {
		return undefined;
	}

	const topic = topics.find((cur) => cur.id === id);
	if (!topic) {
		throw new Error(`No topic found for id "${id}".`);
	}

	return topic;
}

export function useTopics() {
	const { topics } = useContext(TopicsContext);
	if (!topics) {
		throw new Error('`TopicsProvider` was not initialized.');
	}

	return topics;
}

export function useTopic(id?: number) {
	return getTopic(useTopics(), id);
}
