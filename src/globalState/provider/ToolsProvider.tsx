import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { AUTHORITIES, hasUserAuthority } from '../helpers';
import { apiGetTools } from '../../api/apiGetTools';
import { TenantContext } from './TenantProvider';
import { APIToolsInterface } from '../interfaces';
import { UserDataContext } from './UserDataProvider';

type TToolsContext = {
	tools: APIToolsInterface[];
	hasTools: boolean;
};

export const ToolsContext = createContext<TToolsContext>(null);

export function ToolsProvider(props) {
	const { tenant } = useContext(TenantContext);
	const { userData } = useContext(UserDataContext);

	const [tools, setTools] = useState([]);

	useEffect(() => {
		if (
			tenant?.settings?.featureToolsEnabled &&
			!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			apiGetTools(userData.userId).then(setTools);
		}
	}, [tenant?.settings?.featureToolsEnabled, userData]);

	return (
		<ToolsContext.Provider
			value={{
				tools,
				hasTools:
					tools.filter((tool) => tool.sharedWithAdviceSeeker).length >
					0
			}}
		>
			{props.children}
		</ToolsContext.Provider>
	);
}
