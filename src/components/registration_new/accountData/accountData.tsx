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
	const { t: translate } = useTranslation();
	const [password, setPassword] = useState<string>('');
	const [repeatPassword, setRepeatPassword] = useState<string>('');
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>();
	const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] =
		useState<boolean>();
	const [username, setUsername] = useState<string>('');
	return (
		<>
			<Typography variant="h3">
				{translate('registration.account.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{translate('registration.account.subline')}
			</Typography>
			<Input
				startAdornement={
					<InputAdornment position="start">
						<PersonIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setUsername(val);
				}}
				value={username}
				label={translate('registration.account.username.label')}
				info={translate('registration.account.username.info')}
				errorMessage={translate('registration.account.username.error')}
				successMesssage={translate(
					'registration.account.username.success'
				)}
				isValueValid={(val: string) => val.length >= 5}
			></Input>
			<Input
				inputType={isPasswordVisible ? 'text' : 'password'}
				startAdornement={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornement={
					<InputAdornment
						position="start"
						aria-label={translate('login.password.show')}
						title={translate('login.password.show')}
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
				label={translate('registration.account.password.label')}
				multipleCriteria={[
					{
						info: translate(
							'registration.account.password.criteria1'
						),
						validation: (val) => val.length > 9
					},
					{
						info: translate(
							'registration.account.password.criteria2'
						),
						validation: (val) => hasNumber(val)
					},
					{
						info: translate(
							'registration.account.password.criteria3'
						),
						validation: (val) => hasMixedLetters(val)
					},
					{
						info: translate(
							'registration.account.password.criteria4'
						),
						validation: (val) => hasSpecialChar(val)
					}
				]}
			></Input>
			<Input
				inputType={isRepeatPasswordVisible ? 'text' : 'password'}
				startAdornement={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornement={
					<InputAdornment
						position="start"
						aria-label={translate('login.password.show')}
						title={translate('login.password.show')}
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
				label={translate('registration.account.repeatPassword.label')}
				isValueValid={(val) => val === password && password.length > 0}
				errorMessage={translate(
					'registration.account.repeatPassword.error'
				)}
				successMesssage={translate(
					'registration.account.repeatPassword.success'
				)}
			></Input>
			<FormGroup sx={{ mt: '40px' }}>
				<FormControlLabel
					sx={{ alignItems: 'flex-start' }}
					control={<Checkbox sx={{ pt: 0 }} />}
					label={
						<Typography>
							{translate(
								'registration.dataProtection.label.prefix'
							)}
							{legalLinks
								.filter((legalLink) => legalLink.registration)
								.map((legalLink, index, { length }) => {
									let linkPrefix = '';
									if (index > 0) {
										linkPrefix =
											index < length - 1
												? ', '
												: translate(
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
												{translate(legalLink.label)}
											</Link>
										</>
									);
								})}
							{translate(
								'registration.dataProtection.label.suffix'
							)}
						</Typography>
					}
				/>
			</FormGroup>
		</>
	);
};
