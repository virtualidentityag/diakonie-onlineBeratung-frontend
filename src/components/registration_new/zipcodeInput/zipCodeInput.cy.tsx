import React from 'react';
import { ZipcodeInput } from './zipcodeInput';

it('shows correct label', () => {
	cy.mount(<ZipcodeInput />);
	cy.get('label').should('contains.text', 'registration.zipcode.label');
});

it('shows correct value', () => {
	cy.mount(<ZipcodeInput />);
	cy.get('input').type('12345');
	cy.get('input').invoke('val').should('equal', '12345');
});

it('show invalid input onBlur', () => {
	cy.mount(<ZipcodeInput />);
	cy.get('input').type('123');
	cy.get('body').click(0, 0);
	cy.get('input').should('have.attr', 'aria-invalid', 'true');
});

it('does not show wrong characters', () => {
	cy.mount(<ZipcodeInput />);
	cy.get('input').type('abc123');
	cy.get('input').invoke('val').should('equal', '123');
});
