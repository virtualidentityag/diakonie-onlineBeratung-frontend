import {
	Typography,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControlLabel,
	Radio,
	RadioGroup,
	Tooltip,
	FormControl,
	Modal,
	Button
} from '@mui/material';
import * as React from 'react';
import { VFC, useContext, useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../../../globalState';
import { apiGetTopicGroups } from '../../../api/apiGetTopicGroups';
import { TopicGroup } from '../../../globalState/interfaces/TopicGroups';
import { apiGetTopicsData } from '../../../api/apiGetTopicsData';
import { TopicsDataInterface } from '../../../globalState/interfaces/TopicsDataInterface';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link as RouterLink } from 'react-router-dom';

export const TopicSelection: VFC<{
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ nextStepUrl, onNextClick }) => {
	const {
		setDisabledNextButton,
		setDataForSessionStorage,
		sessionStorageRegistrationData
	} = useContext(RegistrationContext);
	const { t } = useTranslation();
	const [value, setValue] = useState<number>(
		sessionStorageRegistrationData.topicId || undefined
	);
	const [infoOverlayContent, setInfoOverlayContent] = useState<string>('');
	const [isInfoOverlayOpen, setIsInfoOverlayOpen] = useState<boolean>(false);
	const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
	const [topics, setTopics] = useState<TopicsDataInterface[]>([]);

	const getTopic = (topicId: number) => {
		return topics?.filter((topic) => topic?.id === topicId)?.[0];
	};

	useEffect(() => {
		if (value) {
			setDisabledNextButton(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		(async () => {
			try {
				const topicGroupsResponse = await apiGetTopicGroups();
				const topicsResponse = await apiGetTopicsData();

				setTopics(topicsResponse);
				setTopicGroups(
					topicGroupsResponse.data.items
						.filter((topicGroup) => topicGroup.topicIds.length > 0)
						.sort((a, b) => {
							if (a.name === b.name) return 0;
							return a.name < b.name ? -1 : 1;
						})
				);
			} catch {
				setTopics([]);
				setTopicGroups([]);
			}
		})();
	}, []);

	return (
		<>
			<Typography variant="h3">
				{t('registration.topic.headline')}
			</Typography>
			<Typography sx={{ mt: '16px', mb: '24px' }}>
				{t('registration.topic.subline')}
			</Typography>
			<FormControl sx={{ width: '100%' }}>
				<RadioGroup aria-label="topic-selection" name="topic-selection">
					{topicGroups &&
						topics &&
						topicGroups.map((topicGroup) => (
							<Accordion
								defaultExpanded={topicGroup.topicIds.includes(
									value
								)}
								sx={{
									'boxShadow': 'none',
									'borderBottom': '1px solid #dddddd',
									'borderRadius': '4px',
									'&:before': {
										display: 'none'
									},
									'& .MuiAccordionSummary-root:hover': {
										backgroundColor: 'primary.lighter'
									},
									'&.Mui-expanded': {
										margin: 0
									}
								}}
							>
								<AccordionSummary
									expandIcon={
										<ExpandMoreIcon
											color="info"
											sx={{
												p: '6px',
												width: '42px',
												height: '42px'
											}}
										/>
									}
									aria-controls={`panel-${topicGroup.name}-content`}
									id={`panel-${topicGroup.name}`}
									sx={{
										'& .MuiAccordionSummary-content.Mui-expanded':
											{
												m: '12px 0'
											}
									}}
								>
									<Typography
										variant="h4"
										sx={{
											lineHeight: '28px',
											fontWeight: '400',
											py: '12px'
										}}
									>
										{topicGroup.name}
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ pt: 0 }}>
									{topicGroup.topicIds
										.map((t) => getTopic(t))
										.sort((a, b) => {
											if (a.name === b.name) return 0;
											return a.name < b.name ? -1 : 1;
										})
										.map((topic, index) => (
											<Box
												sx={{
													display: 'flex',
													justifyContent:
														'space-between',
													width: '100%',
													mt:
														index === 0
															? '0'
															: '16px'
												}}
											>
												<FormControlLabel
													sx={{
														alignItems: 'flex-start'
													}}
													value={topic?.id}
													control={
														<Radio
															onClick={() => {
																setValue(
																	topic.id
																);
																setDataForSessionStorage(
																	{
																		topicId:
																			topic?.id
																	}
																);
															}}
															checked={
																value ===
																topic?.id
															}
														/>
													}
													label={
														<Box
															sx={{
																mt: '10px',
																ml: '10px'
															}}
														>
															<Typography variant="body1">
																{topic?.name}
															</Typography>
														</Box>
													}
												/>
												{topic.description && (
													<>
														<Tooltip
															title={
																topic.description
															}
															arrow
														>
															<InfoIcon
																sx={{
																	display: {
																		xs: 'none',
																		md: 'inline'
																	},
																	p: '9px',
																	width: '42px',
																	height: '42px'
																}}
															></InfoIcon>
														</Tooltip>
														<InfoIcon
															onClick={() => {
																setDataForSessionStorage(
																	{
																		topicId:
																			topic.id
																	}
																);
																setValue(
																	topic.id
																);
																setIsInfoOverlayOpen(
																	true
																);
																setInfoOverlayContent(
																	topic.description
																);
															}}
															sx={{
																display: {
																	xs: 'inline',
																	md: 'none'
																},
																cursor: 'pointer',
																p: '9px',
																width: '42px',
																height: '42px'
															}}
														></InfoIcon>
													</>
												)}
											</Box>
										))}
								</AccordionDetails>
							</Accordion>
						))}
				</RadioGroup>
			</FormControl>
			<Modal
				open={isInfoOverlayOpen}
				onClose={() => {
					setValue(undefined);
					setIsInfoOverlayOpen(false);
				}}
			>
				<Box
					sx={{
						width: '100vw',
						height: '100vh',
						overflowY: 'scroll',
						backgroundColor: 'white',
						p: '22px'
					}}
				>
					<ArrowBackIosIcon
						sx={{
							mb: '26px',
							cursor: 'pointer',
							p: '9px',
							width: '42px',
							height: '42px'
						}}
						onClick={() => {
							setIsInfoOverlayOpen(false);
						}}
					/>

					<Typography>{infoOverlayContent}</Typography>
					<Button
						fullWidth
						sx={{ mt: '16px' }}
						variant="contained"
						component={RouterLink}
						to={nextStepUrl}
						onClick={onNextClick}
					>
						Thema auswählen und fortfahren
					</Button>
					<Button
						fullWidth
						sx={{ mt: '24px' }}
						variant="outlined"
						onClick={() => {
							setValue(undefined);
							setIsInfoOverlayOpen(false);
						}}
					>
						Anderes Thema auswählen
					</Button>
				</Box>
			</Modal>
		</>
	);
};
