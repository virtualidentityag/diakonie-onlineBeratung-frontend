import { endpoints } from '../resources/scripts/endpoints';
import { logout } from '../components/logout/logout';
import { appConfig } from '../utils/appConfig';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

/**
 * fetchData leaves a request pending for any status that is not listed in
 * `responseHandling`, and its CATCH_ALL branch runs before its 401 -> logout branch.
 * So every error status is rejected here (with the Response) and the 401 logout is
 * restored locally. A successful 204 still resolves.
 */
const handleRegistrationUrlError = (error: unknown) => {
	if (error instanceof Response && error.status === 401) {
		logout(true, appConfig.urls.toLogin);
	}
	throw error;
};

/**
 * Sets/updates the shared registration redirect URL of an agency the current
 * consultant is assigned to.
 */
export const apiSetAgencyRegistrationUrl = async (
	agencyId: number,
	registrationUrl: string
): Promise<any> => {
	return fetchData({
		url: endpoints.consultantAgencyRegistrationUrl(agencyId),
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ registrationUrl }),
		rcValidation: true,
		// The endpoint answers 204 on success; do NOT pass FETCH_ERRORS.EMPTY here, otherwise
		// fetchData turns the successful 204 into a rejection.
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	}).catch(handleRegistrationUrlError);
};

/**
 * Removes the shared registration redirect URL of an agency the current consultant
 * is assigned to.
 */
export const apiDeleteAgencyRegistrationUrl = async (
	agencyId: number
): Promise<any> => {
	return fetchData({
		url: endpoints.consultantAgencyRegistrationUrl(agencyId),
		method: FETCH_METHODS.DELETE,
		rcValidation: true,
		// The endpoint answers 204 on success; do NOT pass FETCH_ERRORS.EMPTY here, otherwise
		// fetchData turns the successful 204 into a rejection.
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	}).catch(handleRegistrationUrlError);
};
