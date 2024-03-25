// DOB-83: Replace this with auto-generated interfaces from dtsgen.

export type RequiredComponentsInterface = {
	age?: {
		isEnabled: boolean;
		options: Array<{ value: string; label: string }>;
	};
	state?: {
		isEnabled: boolean;
	};
};

export type RegistrationNotesInterface = {
	agencySelection?: string;
	password?: string;
};

export type RegistrationWelcomeScreenInterface = {
	anonymous: {
		title: string;
		text: string;
	};
};

/**
 * @deprecated
 */
export interface ConsultingTypeBasicInterface {
	id: number;
	isAnonymousConversationAllowed: boolean;
	isSubsequentRegistrationAllowed: boolean;
	registration: {
		autoSelectAgency: boolean;
		autoSelectPostcode: boolean;
		notes: RegistrationNotesInterface;
	};
	/** @deprecated should be moved to topic */
	groupChat: {
		isGroupChat: boolean;
		groupChatRules: [string];
	};
}

/**
 * @deprecated
 */
export interface ConsultingTypeInterface extends ConsultingTypeBasicInterface {
	description: string;
	slug: string;
	furtherInformation?: {
		label: string;
		url: string;
	};
	requiredComponents?: RequiredComponentsInterface;
	languageFormal: boolean;
	welcomeScreen: RegistrationWelcomeScreenInterface;
}

/**
 * @deprecated
 */
export interface ConsultingTypeInterfaceNew
	extends ConsultingTypeBasicInterface {
	description: string;
	furtherInformation?: {
		label: string;
		url: string;
	};
	languageFormal: boolean;
}
