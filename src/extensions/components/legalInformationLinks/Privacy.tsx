import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTenant } from '../../../..';
import { LegalPageWrapper } from '../legalPageWrapper/LegalPageWrapper';
import useDocumentTitle from '../../resources/utils/useDocumentTitle';

export const Privacy = () => {
	const [t] = useTranslation();
	const tenant = useTenant();
	useDocumentTitle(t('profile.footer.dataprotection'));
	return (
		<LegalPageWrapper
			content={
				tenant?.content?.privacy || t('profile.footer.dataprotection')
			}
			className={'terms'}
		/>
	);
};
