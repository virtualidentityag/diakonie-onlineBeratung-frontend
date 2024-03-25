import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import {
	ConsultantDataInterface,
	ConsultingTypeBasicInterface
} from '../globalState';
import { TopicsDataInterface } from '../globalState';

export const apiGetConsultant = async (
	consultantId: any,
	consultingTypes?: ConsultingTypeBasicInterface[],
	topics?: TopicsDataInterface[],
	catchAllErrors?: boolean
): Promise<ConsultantDataInterface> => {
	const url = endpoints.agencyConsultants + '/' + consultantId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [
			FETCH_ERRORS.EMPTY,
			FETCH_ERRORS.NO_MATCH,
			catchAllErrors && FETCH_ERRORS.CATCH_ALL
		]
	}).then((user) => {
		if (!consultingTypes) {
			return user;
		}

		const mappedUserAgencies = user.agencies.map((agency) => ({
			...agency,
			consultingTypeRel: consultingTypes.find(
				(type) => type.id === agency.consultingType
			),
			topicRels: topics.filter((topic) =>
				agency.topicIds.includes(topic.id)
			)
		}));

		return {
			...user,
			agencies: mappedUserAgencies
		};
	});
};
