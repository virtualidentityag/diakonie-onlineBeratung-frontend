import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { config, routePathNames } from './resources/scripts/config';
import { UrlParamsProvider } from '../globalState/provider/UrlParamsProvider';
import { RegistrationProvider } from '../globalState';
import { lazy } from 'react';
import '../resources/styles/mui-variables-mapping.scss';
import theme from './theme';
import { Redirect } from 'react-router-dom';
import { TermsAndConditions } from './components/legalInformationLinks/TermsAndConditions';
import { Privacy } from './components/legalInformationLinks/Privacy';
import { Imprint } from './components/legalInformationLinks/Imprint';

const Registration = lazy(() =>
	import('./components/registration/Registration').then((m) => ({
		default: m.Registration
	}))
);

const NewRegistration = () => (
	<UrlParamsProvider>
		<RegistrationProvider>
			<Registration />
		</RegistrationProvider>
	</UrlParamsProvider>
);

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App
			config={config}
			extraRoutes={[
				{
					route: {
						path: [
							'/registration/:step?',
							'/:topicSlug/registration/:step?'
						]
					},
					component: NewRegistration
				},
				{
					route: {
						path: '/themen'
					},
					component: () => (
						<Redirect
							to={'/registration/topic-selection'}
							from={'/themen'}
						/>
					)
				},
				{
					route: { path: routePathNames.termsAndConditions },
					component: TermsAndConditions
				},
				{ route: { path: routePathNames.imprint }, component: Imprint },
				{ route: { path: routePathNames.privacy }, component: Privacy }
			]}
			stageComponent={Stage}
		/>
	</ThemeProvider>,
	document.getElementById('appRoot')
);
