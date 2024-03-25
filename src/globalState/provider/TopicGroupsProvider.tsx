import * as React from 'react';
import { createContext, useState, useContext, FC, useEffect } from 'react';
import { TopicGroup } from '../interfaces';
import { apiGetTopicGroups } from '../../api/apiGetTopicGroups';

export const TopicGroupsContext = createContext<{
	topicGroups: TopicGroup[];
	setTopicGroups: (topicGroups: TopicGroup[]) => void;
}>(null);

export const TopicGroupsProvider: FC = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [topicGroups, setTopicGroups] = useState(null);

	useEffect(() => {
		apiGetTopicGroups()
			.then((res) => setTopicGroups(res.data.items))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return null;

	return (
		<TopicGroupsContext.Provider value={{ topicGroups, setTopicGroups }}>
			{children}
		</TopicGroupsContext.Provider>
	);
};

export function getTopicGroup(topicGroups: TopicGroup[], id?: number) {
	if (id == null) {
		return undefined;
	}

	const topicGroup = topicGroups.find((cur) => cur.id === id);
	if (!topicGroup) {
		throw new Error(`No topic group found for id "${id}".`);
	}

	return topicGroup;
}

export function useTopicGroups() {
	const { topicGroups } = useContext(TopicGroupsContext);
	if (!topicGroups) {
		throw new Error('`TopicGroupsProvider` was not initialized.');
	}

	return topicGroups;
}

export function useTopicGroup(id?: number) {
	return getTopicGroup(useTopicGroups(), id);
}
