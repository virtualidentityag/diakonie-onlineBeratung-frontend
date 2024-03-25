import { TopicsDataInterface } from '../globalState';
import { apiGetTopicsData } from './apiGetTopicsData';

export const apiGetTopicById = async (
	topicId: string | number
): Promise<TopicsDataInterface> => {
	return apiGetTopicsData().then((response) =>
		response.find((topic) => `${topic.id}` === `${topicId}`)
	);
};
