import { APIToolsInterface } from '../globalState/interfaces';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiGetTools = async (
	userId: string
): Promise<APIToolsInterface[]> =>
	fetchData({
		url: endpoints.budibaseTools(userId),
		method: FETCH_METHODS.GET,
		skipAuth: false,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
