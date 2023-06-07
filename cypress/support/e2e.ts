import 'cypress-file-upload';
import './commands';
import './commands/askerSessions';
import './commands/consultantSessions';
import './commands/login';
import './commands/messages';
import './commands/mockApi';
import './commands/socket';

beforeEach(() => {
	window.localStorage.setItem('locale', 'de');
	window.localStorage.setItem('showDevTools', '0');
	window.localStorage.setItem('e2ee_disabled', '1');
});

afterEach(() => {
	cy.window().then((win) => {
		win.location.href = 'about:blank';
	});
	cy.url().should('eq', 'about:blank');
});
