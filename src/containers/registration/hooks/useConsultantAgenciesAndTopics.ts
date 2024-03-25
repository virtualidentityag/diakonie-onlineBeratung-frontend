import { useState, useEffect, useContext } from 'react';
import unionBy from 'lodash/unionBy';
import {
	ConsultingTypeInterface,
	AgencyDataInterface,
	TopicsDataInterface
} from '../../../globalState';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

export const useConsultantAgenciesAndTopics = () => {
	const settings = useAppConfig();
	const {
		consultingType,
		consultant: consultantFromUrl,
		agency,
		topic
	} = useContext(UrlParamsContext);

	const [consultingTypes, setConsultingTypes] = useState<
		ConsultingTypeInterface[]
	>([]);
	const [topics, setTopics] = useState<TopicsDataInterface[]>([]);

	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

	useEffect(() => {
		if (!consultantFromUrl) {
			return;
		}

		// When we've the multi tenancy with single domain we can simply ignore the
		// consulting types because we'll get agencies across tenants
		// ToDo: This logic breaks consultant direct links with multiple consulting types
		if (
			settings.multitenancyWithSingleDomainEnabled &&
			consultantFromUrl?.agencies?.length > 0
		) {
			setAgencies(consultantFromUrl?.agencies);
			setConsultingTypes([consultingType]);
			setTopics([topic]);
			return;
		}

		const topics =
			// Remove consultingType duplicates
			unionBy(
				consultantFromUrl.agencies.reduce(
					(acc, { topicRels }) => acc.concat(topicRels),
					[]
				),
				'id'
			)
				// If consultingType was preselected by url slug
				.filter((t) => !topic || t.id === topic.id);

		if (agency) {
			const topicIds = topics.map((t) => t.id);
			const preselectedAgency = consultantFromUrl.agencies.find(
				(a) =>
					a.id === agency.id &&
					topicIds.find((topicId) => a.topicIds.includes(topicId))
			);
			if (preselectedAgency) {
				setAgencies([preselectedAgency]);
				setConsultingTypes([preselectedAgency.consultingTypeRel]);
				setTopics(preselectedAgency.topicRels);
				return;
			}
		}

		const possibleAgencies = consultantFromUrl.agencies
			// If a consultingType is selected filter the agencies
			.filter((agency) =>
				topics.find((topic) => topic.id === agency.consultingType)
			);

		setAgencies(possibleAgencies);
		setConsultingTypes(consultingTypes);
		setTopics(topics);
	}, [
		consultantFromUrl,
		consultingType,
		agency,
		settings.multitenancyWithSingleDomainEnabled,
		consultingTypes,
		topic
	]);

	return { agencies, consultingTypes, topics };
};
