import {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState
} from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { apiGetAgencyById } from '../../api';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { PreselectionError } from '../../components/registration_new/preselectionError/PreselectionError';
import { apiGetConsultant } from '../../api/apiGetConsultant';
import { ConsultantDataInterface } from '../interfaces/UserDataInterface';

interface RegistrationContextInterface {
	disabledNextButton?: boolean;
	setDisabledNextButton?: Dispatch<SetStateAction<boolean>>;
	setDataForSessionStorage?: Dispatch<
		SetStateAction<Partial<RegistrationSessionStorageData>>
	>;
	sessionStorageRegistrationData?: RegistrationSessionStorageData;
	dataPrepForSessionStorage?: Partial<RegistrationSessionStorageData>;
	updateSessionStorageWithPreppedData?: () => void;
	refreshSessionStorageRegistrationData?: () => void;
	availableSteps?: {
		component: string;
		urlSuffix?: string;
		mandatoryFields?: string[];
		urlParams?: string[];
	}[];
	preselectedData?: Array<'tid' | 'zipcode' | 'aid'>;
	preselectedAgencyName?: string;
	preselectedTopicName?: string;
	isConsultantLink?: boolean;
	consultant?: ConsultantDataInterface;
}

export const RegistrationContext = createContext<RegistrationContextInterface>(
	{}
);

interface RegistrationSessionStorageData {
	username: string;
	password: string;
	agencyId: number;
	agencyZipcode: string;
	topicId: number;
	zipcode: string;
}

export const registrationSessionStorageKey = 'registrationData';

export function RegistrationProvider(props) {
	const getSessionStorageData = () =>
		JSON.parse(
			sessionStorage.getItem(registrationSessionStorageKey) || '{}'
		);
	const [disabledNextButton, setDisabledNextButton] = useState<boolean>(true);
	const [errors, setErrors] = useState<Array<'tid' | 'cid' | 'aid'>>([]);
	const [hasTopicError, setHasTopicError] = useState<boolean>(false);
	const [hasAgencyError, setHasAgencyError] = useState<boolean>(false);
	const [hasConsultantError, setHasConsultantError] =
		useState<boolean>(false);
	const [isConsultantLink, setIsConsultantLink] = useState<boolean>(false);
	const [consultant, setConsultant] = useState<ConsultantDataInterface>();
	const [preselectedData, setPreselectedData] = useState<
		Array<'tid' | 'zipcode' | 'aid'>
	>([]);
	const [preselectedAgencyName, setPreselectedAgencyName] =
		useState<string>();
	const [preselectedTopicName, setPreselectedTopicName] = useState<string>();
	const [dataPrepForSessionStorage, setDataPrepForSessionStorage] = useState<
		Partial<RegistrationSessionStorageData>
	>({});
	const [sessionStorageRegistrationData, setSessionStorageRegistrationData] =
		useState<any>(getSessionStorageData());
	const useQuery = () => {
		const { search } = useLocation();
		return useMemo(() => new URLSearchParams(search), [search]);
	};
	const urlQuery: URLSearchParams = useQuery();
	const defaultSteps = [
		{ component: 'welcome', urlSuffix: '' },
		{
			component: 'topicSelection',
			urlSuffix: '/topic-selection',
			mandatoryFields: ['topicId'],
			urlParams: ['tid']
		},
		{
			component: 'zipcode',
			urlSuffix: '/zipcode',
			mandatoryFields: ['zipcode'],
			urlParams: ['zipcode']
		},
		{
			component: 'agencySelection',
			urlSuffix: '/agency-selection',
			mandatoryFields: ['agencyId'],
			urlParams: ['aid']
		},
		{
			component: 'accountData',
			urlSuffix: '/account-data',
			mandatoryFields: ['username', 'password']
		}
	];
	const [availableSteps, setAvailableSteps] = useState(defaultSteps);

	useEffect(() => {
		if (
			urlQuery.get('zipcode') ||
			urlQuery.get('aid') ||
			urlQuery.get('tid')
		) {
			const zipcodeRegex = new RegExp(
				/^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/
			);
			const isZipcodeValid = zipcodeRegex.test(urlQuery.get('zipcode'));
			sessionStorage.removeItem(registrationSessionStorageKey);
			setPreselectedData(
				[
					urlQuery.get('zipcode') && isZipcodeValid ? 'zipcode' : '',
					urlQuery.get('aid') ? 'aid' : '',
					urlQuery.get('tid') ? 'tid' : ''
				].filter((preselection) => preselection !== '') as (
					| 'tid'
					| 'aid'
					| 'zipcode'
				)[]
			);
			updateSessionStorage({
				zipcode: isZipcodeValid ? urlQuery.get('zipcode') : undefined,
				agencyId: parseInt(urlQuery.get('aid')),
				topicId: parseInt(urlQuery.get('tid'))
			});

			setAvailableSteps(
				availableSteps.filter(
					(step) =>
						!step.urlParams?.every(
							(param) =>
								urlQuery.get(param) &&
								(param !== 'zipcode' || isZipcodeValid)
						)
				)
			);
		}
		if (urlQuery.get('cid')) {
			(async () => {
				try {
					const consultantResponse = await apiGetConsultant(
						urlQuery.get('cid'),
						true,
						'basic',
						true
					);
					setIsConsultantLink(true);
					setConsultant(consultantResponse);
				} catch {
					setHasConsultantError(true);
					setIsConsultantLink(false);
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlQuery]);

	useEffect(() => {
		// TODO: Check if topic and agency match once agencies get topics
		if (sessionStorageRegistrationData.topicId) {
			(async () => {
				try {
					const topicsResponse = await apiGetTopicsData();
					setPreselectedTopicName(
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.topicId
						)[0]?.name || undefined
					);
					if (
						urlQuery.get('tid') &&
						topicsResponse.filter(
							(topic) =>
								topic.id ===
								sessionStorageRegistrationData.topicId
						)[0]?.name === undefined
					) {
						updateSessionStorage({
							topicId: undefined
						});
						setHasTopicError(true);
					}
				} catch {
					setPreselectedTopicName(undefined);
					if (urlQuery.get('tid')) {
						updateSessionStorage({
							topicId: undefined
						});
						setHasTopicError(true);
					}
				}
			})();
		}
		if (sessionStorageRegistrationData.agencyId) {
			(async () => {
				try {
					const agencyResponse = await apiGetAgencyById(
						sessionStorageRegistrationData.agencyId
					);
					setPreselectedAgencyName(agencyResponse.name || undefined);
				} catch {
					setPreselectedAgencyName(undefined);
					if (urlQuery.get('aid')) {
						updateSessionStorage({
							agencyId: undefined
						});
						setHasAgencyError(true);
					}
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionStorageRegistrationData]);

	useEffect(() => {
		if (hasAgencyError && hasTopicError) {
			setErrors(['tid', 'aid']);
		} else if (hasAgencyError) {
			setErrors(['aid']);
		} else if (hasTopicError) {
			setErrors(['tid']);
		} else if (hasConsultantError) {
			setErrors(['cid']);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasTopicError, hasAgencyError, hasConsultantError]);

	useEffect(() => {
		console.log(preselectedData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedData]);

	useEffect(() => {
		if (errors.length > 0) {
			setAvailableSteps(
				defaultSteps.filter(
					(step) =>
						!step.urlParams?.every(
							(param) =>
								urlQuery.get(param) &&
								!errors.includes(param as any)
						)
				)
			);
			if (
				(!urlQuery.get('aid') || errors.includes('aid')) &&
				(!urlQuery.get('tid') || errors.includes('tid'))
			) {
				setPreselectedData([]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors]);

	const updateSessionStorage = (
		dataToAdd?: Partial<RegistrationSessionStorageData>
	) => {
		const updatedData = {
			...sessionStorageRegistrationData,
			...dataPrepForSessionStorage,
			...dataToAdd
		};

		sessionStorage.setItem(
			registrationSessionStorageKey,
			JSON.stringify(updatedData)
		);
		setSessionStorageRegistrationData(updatedData);
	};

	const refreshSessionStorage = () => {
		setSessionStorageRegistrationData(getSessionStorageData());
	};

	return (
		<RegistrationContext.Provider
			value={{
				disabledNextButton,
				setDisabledNextButton,
				dataPrepForSessionStorage,
				setDataForSessionStorage: setDataPrepForSessionStorage,
				sessionStorageRegistrationData,
				updateSessionStorageWithPreppedData: updateSessionStorage,
				refreshSessionStorageRegistrationData: refreshSessionStorage,
				availableSteps,
				preselectedData,
				preselectedAgencyName,
				preselectedTopicName,
				isConsultantLink,
				consultant
			}}
		>
			{props.children}

			<PreselectionError
				open={errors.length > 0}
				handleClose={() => setErrors([])}
				errors={errors}
			></PreselectionError>
		</RegistrationContext.Provider>
	);
}
