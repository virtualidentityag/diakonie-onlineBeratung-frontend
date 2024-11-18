import { test } from '@playwright/test';
import { caritasRework } from '../config';
import { ensureLanguage } from '../utils';

test('Login as an advice seeker', async ({ page }) => {
	const username = process.env.TEST_USERNAME;
	const password = process.env.TEST_PASSWORD;
	ensureLanguage(page);
	await page.goto(`${caritasRework.dev}`);
	await page.getByLabel(/(user\s?name|benutzername)/i).fill(username!);
	await page
		.getByLabel(/pass\s?(word|wort)/i)
		.first()
		.fill(password!);
	await page.getByRole('button', { name: /(einloggen|login)/i }).click();
});
