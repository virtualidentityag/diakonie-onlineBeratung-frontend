import * as React from 'react';
import { Children, ReactNode, ReactElement, useContext } from 'react';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { LocaleContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	AppBar,
	Box,
	Divider,
	IconButton,
	Slide,
	Toolbar,
	Typography,
	useScrollTrigger
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { InfoDrawer } from '../registration_new/infoDrawer/infoDrawer';

interface StageLayoutProps {
	className?: string;
	children: ReactNode;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
	showRegistrationLink?: boolean;
	loginParams?: string;
	showRegistrationInfoDrawer?: boolean;
}

export const StageLayout = ({
	className,
	children,
	stage,
	showLegalLinks,
	showLoginLink,
	showRegistrationLink,
	loginParams,
	showRegistrationInfoDrawer
}: StageLayoutProps) => {
	const trigger = useScrollTrigger();
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const { selectableLocales } = useContext(LocaleContext);
	const settings = useAppConfig();

	return (
		<div className={clsx('stageLayout', className)}>
			<Slide appear={false} direction="down" in={!trigger}>
				<AppBar
					elevation={0}
					sx={{
						display: { md: 'none' },
						zIndex: (theme) => theme.zIndex.drawer + 1
					}}
				>
					<Toolbar variant="dense">
						<Typography
							variant="h6"
							color="inherit"
							component="div"
						>
							{translate('app.stage.title')}
						</Typography>
						<Box sx={{ flexGrow: 1 }} />
						<Box sx={{ display: 'flex' }}>
							{selectableLocales.length > 1 && (
								<LocaleSwitch
									iconOnly={true}
									color="var(--white)"
									colorHover="var(--white)"
								/>
							)}

							{showLoginLink && (
								<IconButton
									href={`${settings.urls.toLogin}${
										loginParams ? `?${loginParams}` : ''
									}`}
									edge="start"
									color="inherit"
									aria-label="menu"
									sx={{ ml: '4px' }}
								>
									<LoginIcon color="inherit" />
								</IconButton>
							)}
						</Box>
					</Toolbar>

					<Divider
						sx={{ borderColor: 'white', borderWidth: '0.5px' }}
					></Divider>
				</AppBar>
			</Slide>
			{showRegistrationInfoDrawer && (
				<InfoDrawer trigger={trigger}></InfoDrawer>
			)}
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<Box
				className={`stageLayout__header`}
				sx={{
					display: {
						xs: 'none',
						md: 'flex'
					}
				}}
			>
				{selectableLocales.length > 1 && (
					<div>
						<LocaleSwitch />
					</div>
				)}
				{showLoginLink && (
					<div className="stageLayout__toLogin">
						<div className="stageLayout__toLogin__button">
							<a
								href={`${settings.urls.toLogin}${
									loginParams ? `?${loginParams}` : ''
								}`}
								tabIndex={-1}
							>
								<Button
									item={{
										label: translate(
											'registration.login.label'
										),
										type: 'TERTIARY'
									}}
									isLink
								/>
							</a>
						</div>
					</div>
				)}

				{showRegistrationLink && (
					<div className="login__tenantRegistration">
						<Text
							text={translate('login.register.infoText.title')}
							type={'infoSmall'}
						/>
						<a
							className="login__tenantRegistrationLink"
							href={settings.urls.toRegistration}
							target="_self"
							tabIndex={-1}
						>
							<Button
								item={{
									label: translate(
										'login.register.linkLabel'
									),
									type: 'TERTIARY'
								}}
								isLink
							/>
						</a>
					</div>
				)}
			</Box>

			<Box
				sx={{
					mt: {
						xs: showRegistrationInfoDrawer ? '96px' : '48px',
						md: '0'
					}
				}}
				className="stageLayout__content"
			>
				{children}
			</Box>

			<div className="stageLayout__footer">
				{showLegalLinks && (
					<div className={`stageLayout__legalLinks`}>
						{legalLinks.map((legalLink, index) => (
							<React.Fragment key={legalLink.url}>
								{index > 0 && (
									<Text
										type="infoSmall"
										className="stageLayout__legalLinksSeparator"
										text=" | "
									/>
								)}
								<button
									type="button"
									className="button-as-link"
									data-cy-link={legalLink.url}
									onClick={() =>
										window.open(legalLink.url, '_blank')
									}
								>
									<Text
										className="stageLayout__legalLinksItem"
										type="infoSmall"
										text={translate(legalLink.label)}
									/>
								</button>
							</React.Fragment>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
