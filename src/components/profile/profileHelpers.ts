import {
	UserDataInterface,
	ConsultingTypeBasicInterface
} from '../../globalState';
import { TopicsDataInterface } from '../../globalState';
import { SelectOption } from '../select/SelectDropdown';

export const convertUserDataObjectToArray = (object) => {
	const array = [];
	Object.keys(object).forEach((key) => {
		let test = {
			type: key,
			value:
				object[key] && typeof object[key] === 'object'
					? convertUserDataObjectToArray(object[key])
					: object[key]
		};
		array.push(test);
	});
	return array;
};

export const getUserDataTranslateBase = (consultingType: number) => {
	return consultingType === 0 ? 'user.userAddiction' : 'user.userU25';
};

export enum REGISTRATION_STATUS_KEYS {
	REGISTERED = 'REGISTERED',
	UNREGISTERED = 'UNREGISTERED'
}
export const getConsultingTypesForRegistrationStatus = (
	userData: UserDataInterface,
	registrationStatus: REGISTRATION_STATUS_KEYS,
	// ToDo: Replace consutingTypes with topics when isSubsequentRegistrationAllowed is migrated
	consultingTypes?: Array<ConsultingTypeBasicInterface>
) => {
	if (
		registrationStatus !== REGISTRATION_STATUS_KEYS.REGISTERED &&
		consultingTypes === undefined
	) {
		throw new Error(
			`getConsultingTypesForRegistrationStatus requires consultingTypes if registrationStatus is not ${REGISTRATION_STATUS_KEYS.REGISTERED}`
		);
	}

	// ToDo: Replace userData.consultingTypes to userData.topics when migrated
	return Object.keys(userData.consultingTypes)
		.map((key) => ({
			consultingTypeId: parseInt(key),
			data: userData.consultingTypes[key]
		}))
		.filter((value) =>
			registrationStatus === REGISTRATION_STATUS_KEYS.REGISTERED
				? value.data.isRegistered
				: !value.data.isRegistered &&
				  consultingTypes.find(
						(cur) => cur.id === value.consultingTypeId
				  )?.isSubsequentRegistrationAllowed
		);
};

export const topicsSelectOptionsSet = (
	userData: UserDataInterface,
	consultingTypes: ConsultingTypeBasicInterface[],
	topics: TopicsDataInterface[]
): SelectOption[] => {
	// ToDo: ISSUE: We don't know which topic is already registered
	const unregisteredConsultingTypesData =
		getConsultingTypesForRegistrationStatus(
			userData,
			REGISTRATION_STATUS_KEYS.UNREGISTERED,
			consultingTypes
		);

	return unregisteredConsultingTypesData
		.map((value) => {
			/**
			 * ToDo: find topic by topic id when getConsultingTypesForRegistrationStatus is refactored.
			 * Currently return null to prevent errors from non matching consultingType to topic ids
			 */
			const topic = topics.find((t) => t.id === value.consultingTypeId);
			if (!topic) return null;

			return {
				value: topic.id.toString(),
				label: topic.titles.registrationDropdown
			};
		})
		.filter(Boolean);
};

export const isUniqueLanguage = (value, index, self) => {
	return self.indexOf(value) === index;
};
