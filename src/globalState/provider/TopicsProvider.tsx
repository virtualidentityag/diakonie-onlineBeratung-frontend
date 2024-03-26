import * as React from 'react';
import { createContext, useState, useContext } from 'react';
import { TopicsDataInterface } from '../interfaces';

export const TopicsContext = createContext<{
	topics: Array<TopicsDataInterface>;
	setTopics: (topics: Array<TopicsDataInterface>) => void;
}>(null);

export function TopicsProvider(props) {
	const [topics, setTopics] = useState(null);

	return (
		<TopicsContext.Provider value={{ topics, setTopics }}>
			{props.children}
		</TopicsContext.Provider>
	);
}

export function getTopics(topics: Array<TopicsDataInterface>, id?: number) {
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
	return getTopics(useTopics(), id);
}
