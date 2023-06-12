import * as React from 'react';
import { useState, useEffect, VFC, useContext } from 'react';
import { AgencySelectionInput } from './agencySelectionInput';
import { AgencySelectionResults } from './agencySelectionResults';
import { apiAgencySelection } from '../../../api';
import { AgencyDataInterface, RegistrationContext } from '../../../globalState';

export const AgencySelection: VFC = () => {
	const { sessionStorageRegistrationData } = useContext(RegistrationContext);
	const [value, setValue] = useState<string>(
		sessionStorageRegistrationData.agencyZipcode || undefined
	);
	const [headlineZipcode, setHeadlineZipcode] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [results, setResults] = useState<AgencyDataInterface[] | undefined>(
		undefined
	);

	useEffect(() => {
		if (value?.length === 5) {
			setHeadlineZipcode(value);
			setResults(undefined);
			(async () => {
				setIsLoading(true);
				// TODO: Add topic Id when available and remove consultingType
				await apiAgencySelection({
					postcode: value,
					consultingType: 24
				})
					.then((res) => {
						setResults(res);
					})
					.catch(() => {
						setResults([]);
					})
					.finally(() => setIsLoading(false));
			})();
		}
	}, [value]);

	return (
		<>
			<AgencySelectionInput
				value={value}
				onInputChange={(val: string) => {
					setValue(val);
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
