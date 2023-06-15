import { createContext, Dispatch, SetStateAction, useState } from 'react';
import * as React from 'react';

// TODO: Extend with topic registration information so it's available in all steps
type RegistrationContextInterface = {
	disabledNextButton?: boolean;
	setDisabledNextButton?: Dispatch<SetStateAction<boolean>>;
	dataForSessionStorage?: any;
	setDataForSessionStorage?: Dispatch<SetStateAction<any>>;
	sessionStorageRegistrationData?: any;
	setSessionStorageRegistrationData?: Dispatch<SetStateAction<boolean>>;
};

export const RegistrationContext = createContext<RegistrationContextInterface>(
	{}
);

export function RegistrationProvider(props) {
	const [disabledNextButton, setDisabledNextButton] = useState<boolean>(true);
	const [dataForSessionStorage, setDataForSessionStorage] = useState<any>({});
	const [sessionStorageRegistrationData, setSessionStorageRegistrationData] =
		useState<any>({});

	return (
		<RegistrationContext.Provider
			value={{
				disabledNextButton,
				setDisabledNextButton,
				dataForSessionStorage,
				setDataForSessionStorage,
				sessionStorageRegistrationData,
				setSessionStorageRegistrationData
			}}
		>
			{props.children}
		</RegistrationContext.Provider>
	);
}
