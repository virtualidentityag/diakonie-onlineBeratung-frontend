import * as React from 'react';
import { useState, useEffect, VFC, useContext } from 'react';
import { AgencySelectionResults } from './AgencySelectionResults';
import { apiAgencySelection } from '../../../api';
import { AgencyDataInterface, RegistrationContext } from '../../../globalState';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const AgencySelection: VFC<{
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ nextStepUrl, onNextClick }) => {
	const { sessionStorageRegistrationData, isConsultantLink, consultant } =
		useContext(RegistrationContext);

	const { t } = useTranslation();
	const [headlineZipcode, setHeadlineZipcode] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [results, setResults] = useState<AgencyDataInterface[] | undefined>(
		undefined
	);
	useEffect(() => {
		if (isConsultantLink) {
			setResults(consultant.agencies);
		} else if (sessionStorageRegistrationData?.zipcode?.length === 5) {
			setHeadlineZipcode(sessionStorageRegistrationData.zipcode);
			setResults(undefined);
			(async () => {
				setIsLoading(true);
				try {
					const agencyResponse = await apiAgencySelection({
						postcode: sessionStorageRegistrationData.zipcode,
						// We will keep consultingTypeId identical to topicId
						consultingType:
							sessionStorageRegistrationData.topicId || undefined,
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
	}, [sessionStorageRegistrationData, consultant]);

	return (
		<>
			<Typography variant="h3">
				{(isConsultantLink && consultant?.agencies?.length === 1) ||
				results?.length === 1
					? t('registration.agency.consultantheadline')
					: t('registration.agency.headline')}
			</Typography>
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
