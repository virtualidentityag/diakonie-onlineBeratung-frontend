import React from 'react';
import { TopicSelection } from './topicSelection';
import { endpoints } from '../../../resources/scripts/endpoints';
import { RegistrationProvider } from '../../../globalState';

it('Get accordion content', () => {
	cy.fixture('service.topicGroups.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.topicGroups}*`), data).as(
			'topicGroups'
		);
	});
	cy.fixture('service.topics.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.topicsData}*`), data).as('topics');
	});
	cy.mount(
		<RegistrationProvider>
			<TopicSelection nextStepUrl="" onNextClick={() => {}} />
		</RegistrationProvider>
	);
	cy.get('h4').should('contains.text', 'Alter');
});
