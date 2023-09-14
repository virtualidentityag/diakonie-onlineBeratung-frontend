export interface TopicsDataInterface {
	id: number;
	name: string;
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
}
