import React from 'react';
import { render } from 'react-dom';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { DataProtection } from './components/legalInformationLinks/DataProtection';
import { config, legalLinks } from './resources/scripts/config';

render(
	<App
		config={config}
		extraRoutes={[
			{
				route: {
					path: legalLinks.imprint
				},
				component: Imprint
			},
			{
				route: {
					path: legalLinks.privacy
				},
				component: DataProtection
			}
		]}
		stageComponent={Stage}
		entryPoint="/registration"
	/>,
	document.getElementById('appRoot')
);
