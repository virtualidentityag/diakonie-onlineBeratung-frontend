import * as React from 'react';
import { useState, useEffect, VFC, useContext } from 'react';
import { AgencySelectionInput } from './agencySelectionInput';
import { AgencySelectionResults } from './agencySelectionResults';
import { apiAgencySelection } from '../../../api';
import { AgencyDataInterface, RegistrationContext } from '../../../globalState';

export const AgencySelection: VFC = () => {
	const { sessionStorageRegistrationData } = useContext(RegistrationContext);
	const [zipcodeValue, setZipcodeValue] = useState<string>(
		sessionStorageRegistrationData.agencyZipcode || undefined
	);
	const [headlineZipcode, setHeadlineZipcode] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [results, setResults] = useState<AgencyDataInterface[] | undefined>(
		undefined
	);

	useEffect(() => {
		if (zipcodeValue?.length === 5) {
			setHeadlineZipcode(zipcodeValue);
			setResults(undefined);
			(async () => {
				setIsLoading(true);
				// TODO: Add topic Id when available and remove consultingType
				try {
					const agencyResponse = await apiAgencySelection({
						postcode: zipcodeValue,
						consultingType: 10
					});
					console.log(agencyResponse);

					setResults(agencyResponse);
				} catch {
					setResults([]);
				}
				setIsLoading(false);
			})();
		}
	}, [zipcodeValue]);

	return (
		<>
			<AgencySelectionInput
				value={zipcodeValue}
				onInputChange={(val: string) => {
					setZipcodeValue(val);
				}}
			/>
			<AgencySelectionResults
				zipcode={headlineZipcode}
				isLoading={isLoading}
				results={results}
			/>
		</>
	);
};
