import * as React from 'react';
import { useState, useEffect, VFC, useContext } from 'react';
import { AgencySelectionInput } from './agencySelectionInput';
import { AgencySelectionResults } from './agencySelectionResults';
import { apiAgencySelection } from '../../../api';
import { AgencyDataInterface, RegistrationContext } from '../../../globalState';

export const AgencySelection: VFC<{
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ nextStepUrl, onNextClick }) => {
	const { sessionStorageRegistrationData, isConsultantLink, consultant } =
		useContext(RegistrationContext);
	const [zipcodeValue, setZipcodeValue] = useState<string>(
		sessionStorageRegistrationData.zipcode ||
			sessionStorageRegistrationData.agencyZipcode ||
			undefined
	);
	const [headlineZipcode, setHeadlineZipcode] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [results, setResults] = useState<AgencyDataInterface[] | undefined>(
		undefined
	);

	useEffect(() => {
		if (isConsultantLink) {
			setResults(consultant.agencies);
		} else if (zipcodeValue?.length === 5) {
			setHeadlineZipcode(zipcodeValue);
			setResults(undefined);
			(async () => {
				setIsLoading(true);
				try {
					const agencyResponse = await apiAgencySelection({
						postcode: zipcodeValue,
						consultingType: 24,
						topicId:
							sessionStorageRegistrationData.topicId || undefined
					});

					setResults(agencyResponse);
				} catch {
					setResults([]);
				}
				setIsLoading(false);
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [zipcodeValue, consultant]);

	return (
		<>
			<AgencySelectionInput
				value={zipcodeValue}
				onInputChange={(val: string) => {
					setZipcodeValue(val);
				}}
			/>
			<AgencySelectionResults
				nextStepUrl={nextStepUrl}
				onNextClick={onNextClick}
				zipcode={headlineZipcode}
				isLoading={isLoading}
				results={results}
			/>
		</>
	);
};
