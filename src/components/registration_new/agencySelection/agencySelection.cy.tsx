import React from 'react';
import { AgencySelection } from './agencySelection';
import { endpoints } from '../../../resources/scripts/endpoints';
import { RegistrationProvider } from '../../../globalState';

it('Get results for zipcode', () => {
	cy.mount(
		<RegistrationProvider>
			<AgencySelection></AgencySelection>
		</RegistrationProvider>
	);
	cy.fixture('service.agencies.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.agencyServiceBase}*`), data).as(
			'agencies'
		);
	});
	cy.get('input').type('12345');
	cy.get('input').invoke('val').should('equal', '12345');
	cy.get('p').should('contains.text', 'name');
});
