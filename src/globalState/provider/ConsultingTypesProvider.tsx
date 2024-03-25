import * as React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import {
	ConsultingTypeBasicInterface,
	ConsultingTypeInterface
} from '../interfaces';
import { apiGetConsultingType, apiGetConsultingTypes } from '../../api';

/**
 * @deprecated
 */
export const ConsultingTypesContext = createContext<{
	consultingTypes: ConsultingTypeBasicInterface[];
	setConsultingTypes: (
		consultingTypes: ConsultingTypeBasicInterface[]
	) => void;
	getConsultingType: (id: number) => ConsultingTypeBasicInterface;
	getConsultingTypeFull: (id: number) => Promise<ConsultingTypeInterface>;
}>(null);

export function ConsultingTypesProvider(props) {
	const [loading, setLoading] = useState(true);
	const [consultingTypesBasic, setConsultingTypesBasic] =
		useState<ConsultingTypeBasicInterface[]>();
	const [consultingTypesFull, setConsultingTypesFull] =
		useState<ConsultingTypeInterface[]>();

	useEffect(() => {
		apiGetConsultingTypes()
			.then(setConsultingTypesBasic)
			.finally(() => setLoading(false));
	}, []);

	const getConsultingTypeFull = useCallback(
		async (id: number) => {
			let consultingTypeFull = consultingTypesFull.find(
				(cur) => cur.id === id
			);
			if (consultingTypeFull) return consultingTypeFull;

			consultingTypeFull = await apiGetConsultingType({
				consultingTypeId: id
			});

			setConsultingTypesFull((consultingTypesFull) =>
				consultingTypesFull.concat(consultingTypeFull)
			);
			return consultingTypeFull;
		},
		[consultingTypesFull]
	);

	const getConsultingType = useCallback(
		(id: number) => {
			if (!consultingTypesBasic) {
				return undefined;
			}

			const consultingType = consultingTypesBasic.find(
				(cur) => cur.id === id
			);
			if (!consultingType) {
				throw new Error(`No consulting type found for id "${id}".`);
			}

			return consultingType;
		},
		[consultingTypesBasic]
	);

	if (loading) return null;

	return (
		<ConsultingTypesContext.Provider
			value={{
				consultingTypes: consultingTypesBasic,
				setConsultingTypes: setConsultingTypesBasic,
				getConsultingType,
				getConsultingTypeFull
			}}
		>
			{props.children}
		</ConsultingTypesContext.Provider>
	);
}
