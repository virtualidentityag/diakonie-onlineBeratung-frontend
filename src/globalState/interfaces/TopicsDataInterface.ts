import { ConsultingTypeInterface } from './ConsultingTypeInterface';

export interface TopicsDataInterface {
	id: number;
	name: string;
	slug: string;
	description: string;
	internalIdentifier: string;
	status: string;
	createDate: string;
	updateDate: string;
	titles: {
		short: string;
		long: string;
		welcome: string;
		registrationDropdown: string;
	};
	sendNextStepMessage: boolean;
	welcomeMessage: string;
	fallbackAgencyId?: number;
	fallbackUrl?: string;
	/** @deprecated */
	consultingType?: ConsultingTypeInterface;
}
