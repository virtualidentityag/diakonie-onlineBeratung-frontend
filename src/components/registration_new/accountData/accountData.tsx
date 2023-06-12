import {
	Checkbox,
	FormGroup,
	InputAdornment,
	Typography,
	Link,
	FormControlLabel
} from '@mui/material';
import * as React from 'react';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Input } from '../../input/input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
	hasMixedLetters,
	hasNumber,
	hasSpecialChar
} from '../../../utils/validateInputValue';
import { LegalLinksContext } from '../../../globalState/provider/LegalLinksProvider';

export const AccountData = () => {
	const legalLinks = useContext(LegalLinksContext);
	const { t } = useTranslation();
	const [password, setPassword] = useState<string>('');
	const [repeatPassword, setRepeatPassword] = useState<string>('');
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>();
	const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] =
		useState<boolean>();
	const [username, setUsername] = useState<string>('');
	return (
		<>
			<Typography variant="h3">
				{t('registration.account.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{t('registration.account.subline')}
			</Typography>
			<Input
				startAdornment={
					<InputAdornment position="start">
						<PersonIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setUsername(val);
				}}
				value={username}
				label={t('registration.account.username.label')}
				info={t('registration.account.username.info')}
				errorMessage={t('registration.account.username.error')}
				successMesssage={t('registration.account.username.success')}
				isValueValid={(val: string) => val.length >= 5}
			/>
			<Input
				inputType={isPasswordVisible ? 'text' : 'password'}
				startAdornment={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment
						position="start"
						aria-label={t('login.password.show')}
						title={t('login.password.show')}
					>
						<VisibilityIcon
							sx={{ cursor: 'pointer', color: 'info.light' }}
							onClick={() => {
								setIsPasswordVisible(!isPasswordVisible);
							}}
						/>
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setPassword(val);
				}}
				value={password}
				label={t('registration.account.password.label')}
				multipleCriteria={[
					{
						info: t('registration.account.password.criteria1'),
						validation: (val) => val.length > 9
					},
					{
						info: t('registration.account.password.criteria2'),
						validation: (val) => hasNumber(val)
					},
					{
						info: t('registration.account.password.criteria3'),
						validation: (val) => hasMixedLetters(val)
					},
					{
						info: t('registration.account.password.criteria4'),
						validation: (val) => hasSpecialChar(val)
					}
				]}
			/>
			<Input
				inputType={isRepeatPasswordVisible ? 'text' : 'password'}
				startAdornment={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment
						position="start"
						aria-label={t('login.password.show')}
						title={t('login.password.show')}
					>
						<VisibilityIcon
							sx={{ cursor: 'pointer', color: 'info.light' }}
							onClick={() => {
								setIsRepeatPasswordVisible(
									!isRepeatPasswordVisible
								);
							}}
						/>
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setRepeatPassword(val);
				}}
				value={repeatPassword}
				label={t('registration.account.repeatPassword.label')}
				isValueValid={(val) => val === password && password.length > 0}
				errorMessage={t('registration.account.repeatPassword.error')}
				successMesssage={t(
					'registration.account.repeatPassword.success'
				)}
			/>
			<FormGroup sx={{ mt: '40px' }}>
				<FormControlLabel
					sx={{ alignItems: 'flex-start' }}
					control={<Checkbox sx={{ pt: 0 }} />}
					label={
						<Typography>
							{t('registration.dataProtection.label.prefix')}
							{legalLinks
								.filter((legalLink) => legalLink.registration)
								.map((legalLink, index, { length }) => {
									let linkPrefix = '';
									if (index > 0) {
										linkPrefix =
											index < length - 1
												? ', '
												: t(
														'registration.dataProtection.label.and'
												  );
									}
									return (
										<>
											{linkPrefix}
											<Link
												target="_blank"
												href={legalLink.url}
											>
												{t(legalLink.label)}
											</Link>
										</>
									);
								})}
							{t('registration.dataProtection.label.suffix')}
						</Typography>
					}
				/>
			</FormGroup>
		</>
	);
};
