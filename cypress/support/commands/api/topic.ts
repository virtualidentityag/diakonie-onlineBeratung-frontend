import { endpoints } from '../../../../src/resources/scripts/endpoints';

const topicsApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', endpoints.topicsData, (req) => {
		req.reply(getWillReturn('topics') || { statusCode: 204 });
	}).as('topics');
};

export default topicsApi;
