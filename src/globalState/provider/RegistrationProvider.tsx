import { createContext, Dispatch, SetStateAction, useState } from 'react';
import * as React from 'react';

// TODO: Extend with topic registration information so it's available in all steps
// TODO2: make data from sessionStorage available for steps, so when user goes back the fields are still filled
type RegistrationContextInterface = {
	disabledNextButton?: boolean;
	setDisabledNextButton?: Dispatch<SetStateAction<boolean>>;
	dataForSessionStorage?: any;
	setDataForSessionStorage?: Dispatch<SetStateAction<any>>;
	isUsernameAvailable?: boolean;
	setIsUsernameAvailable?: Dispatch<SetStateAction<boolean>>;
};

export const RegistrationContext = createContext<RegistrationContextInterface>(
	{}
);

export function RegistrationProvider(props) {
	const [disabledNextButton, setDisabledNextButton] = useState<boolean>(true);
	const [isUsernameAvailable, setIsUsernameAvailable] =
		useState<boolean>(true);
	const [dataForSessionStorage, setDataForSessionStorage] = useState<any>({});

	return (
		<RegistrationContext.Provider
			value={{
				disabledNextButton,
				setDisabledNextButton,
				dataForSessionStorage,
				setDataForSessionStorage,
				isUsernameAvailable,
				setIsUsernameAvailable
			}}
		>
			{props.children}
		</RegistrationContext.Provider>
	);
}
