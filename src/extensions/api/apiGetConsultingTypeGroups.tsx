import { fetchData, FETCH_METHODS } from '../../api';
import { endpoints } from '../../resources/scripts/endpoints';
import { ConsultingTypeGroupInterface } from '../globalState';

export const apiGetConsultingTypeGroups = async (): Promise<
	Array<ConsultingTypeGroupInterface>
> => {
	return fetchData({
		url: `${endpoints.consultingTypeServiceBase}/groups`,
		method: FETCH_METHODS.GET,
		skipAuth: true
	});
};
