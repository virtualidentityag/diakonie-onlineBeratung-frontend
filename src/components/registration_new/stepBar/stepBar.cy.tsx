import React from 'react';
import { StepBar } from './StepBar';

it('shows correct steps', () => {
	cy.mount(<StepBar maxNumberOfSteps={3} currentStep={1}></StepBar>);
	cy.get('h5').should(
		'contains.text',
		'registration.stepbar.step 1 registration.stepbar.of 3'
	);
});

it('show maxNumberofsteps if currentStep > maxNumberOfSteps', () => {
	cy.mount(<StepBar maxNumberOfSteps={3} currentStep={4}></StepBar>);
	cy.get('h5').should(
		'contains.text',
		'registration.stepbar.step 3 registration.stepbar.of 3'
	);
});
