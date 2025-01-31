import { Typography } from '@mui/material';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiAgencyLanguages } from '../../../../api/apiAgencyLanguages';
import { LanguagesContext } from '../../../../globalState/provider/LanguagesProvider';
import { useAppConfig } from '../../../../hooks/useAppConfig';

interface AgencyLanguagesProps {
	agencyId?: number;
}

export const AgencyLanguages = ({ agencyId }: AgencyLanguagesProps) => {
	const { t } = useTranslation();
	const settings = useAppConfig();
	const [languagesString, setLanguagesString] = useState<string>('');
	const { fixed: fixedLanguages } = useContext(LanguagesContext);

	useEffect(() => {
		(async () => {
			let languages = ['de'];
			if (agencyId !== undefined) {
				languages = await apiAgencyLanguages(
					agencyId,
					settings?.multitenancyWithSingleDomainEnabled
				).then(
					(res) => (languages = [...fixedLanguages, ...res.languages])
				);
			}

			setLanguagesString(
				languages
					.filter(
						(element, index) => languages.indexOf(element) === index
					)
					.map((lang) => {
						const language = t(`languages.${lang}`);
						const languageCode = lang.toUpperCase();
						return `${language} (${languageCode})`;
					})
					.sort((a, b) => a.localeCompare(b))
					.join(' | ')
			);
		})();
	}, [
		agencyId,
		fixedLanguages,
		settings?.multitenancyWithSingleDomainEnabled,
		t
	]);

	return (
		<Typography variant="body2" sx={{ color: 'info.light' }}>
			{languagesString}
		</Typography>
	);
};
