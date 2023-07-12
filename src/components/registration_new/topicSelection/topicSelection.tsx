import {
	Typography,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControlLabel,
	Radio,
	RadioGroup,
	FormControl
} from '@mui/material';
import * as React from 'react';
import { VFC, useContext, useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../../../globalState';
import { apiGetTopicGroups } from '../../../api/apiGetTopicGroups';
import { TopicGroup } from '../../../globalState/interfaces/TopicGroups';
import { apiGetTopicsData } from '../../../api/apiGetTopicsData';
import { TopicsDataInterface } from '../../../globalState/interfaces/TopicsDataInterface';
import { MetaInfo } from '../metaInfo/MetaInfo';
import { Loading } from '../../app/Loading';
import { REGISTRATION_DATA_VALIDATION } from '../registrationWrapper/registrationDataValidation';

export const TopicSelection: VFC<{
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ nextStepUrl, onNextClick }) => {
	const {
		setDisabledNextButton,
		setDataForSessionStorage,
		sessionStorageRegistrationData,
		preselectedData,
		preselectedAgency,
		isConsultantLink,
		consultant,
		hasAgencyError
	} = useContext(RegistrationContext);
	const { t } = useTranslation();
	const [value, setValue] = useState<number>(
		sessionStorageRegistrationData.topicId || undefined
	);
	const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
	const [topics, setTopics] = useState<TopicsDataInterface[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listView, setListView] = useState<boolean>(false);

	const getTopic = (topicId: number) => {
		return topics?.filter((topic) => topic?.id === topicId)?.[0];
	};

	const getFilteredTopics = (topics: TopicsDataInterface[]) => {
		if (preselectedData.includes('aid') && !hasAgencyError) {
			const topicIds = preselectedAgency?.topicIds;
			return topics?.filter((topic) => topicIds.includes(topic.id));
		}
		if (isConsultantLink && consultant) {
			const topicIds = consultant?.agencies
				.map((agency) => agency.topicIds)
				.flat();
			return topics?.filter((topic) => topicIds.includes(topic.id));
		}
		return topics;
	};

	useEffect(() => {
		if (
			REGISTRATION_DATA_VALIDATION.topicId.validation(value?.toString())
		) {
			setDisabledNextButton(false);
		}
	}, [setDisabledNextButton, value]);

	useEffect(() => {
		if (
			(preselectedData.includes('aid') && !hasAgencyError) ||
			(isConsultantLink && consultant)
		) {
			setListView(true);
		} else {
			setListView(false);
		}
	}, [consultant, hasAgencyError, isConsultantLink, preselectedData]);

	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const topicGroupsResponse = await apiGetTopicGroups();
				const topicsResponse = await apiGetTopicsData();

				setTopics(getFilteredTopics(topicsResponse));
				setTopicGroups(
					topicGroupsResponse.data.items
						.filter((topicGroup) => topicGroup.topicIds.length > 0)
						.sort((a, b) => {
							if (a.name === b.name) return 0;
							return a.name < b.name ? -1 : 1;
						})
				);
				setIsLoading(false);
			} catch {
				setTopics([]);
				setTopicGroups([]);
			}
		})();
	}, [consultant, preselectedAgency]);

	return (
		<>
			<Typography variant="h3">
				{t('registration.topic.headline')}
			</Typography>
			<Typography sx={{ mt: '16px', mb: '24px' }}>
				{t('registration.topic.subline')}
			</Typography>
			{isLoading ? (
				<Box
					sx={{
						mt: '80px',
						width: '100%',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<Loading />
				</Box>
			) : (
				<FormControl sx={{ width: '100%' }}>
					<RadioGroup
						aria-label="topic-selection"
						name="topic-selection"
					>
						{topicGroups && topics && listView
							? topics
									.sort((a, b) => {
										if (a.name === b.name) return 0;
										return a.name < b.name ? -1 : 1;
									})
									.map((topic, index) => (
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												width: '100%',
												mt: index === 0 ? '0' : '16px'
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
															setValue(topic.id);
															setDataForSessionStorage(
																{
																	topicId:
																		topic?.id
																}
															);
														}}
														checked={
															value === topic?.id
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
											{topic?.description && (
												<MetaInfo
													description={
														topic.description
													}
													onOverlayClose={() =>
														setValue(undefined)
													}
													backButtonLabel={t(
														'registration.topic.infoOverlay.backButtonLabel'
													)}
													nextButtonLabel={t(
														'registration.topic.infoOverlay.nextButtonLabel'
													)}
													nextStepUrl={nextStepUrl}
													onNextClick={onNextClick}
													onOverlayOpen={() => {
														setDataForSessionStorage(
															{
																topicId:
																	topic.id
															}
														);
														setValue(topic.id);
													}}
												/>
											)}
										</Box>
									))
							: topicGroups.map((topicGroup) => (
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
											'& .MuiAccordionSummary-root:hover':
												{
													backgroundColor:
														'primary.lighter'
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
													if (a.name === b.name)
														return 0;
													return a.name < b.name
														? -1
														: 1;
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
																alignItems:
																	'flex-start'
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
																		{
																			topic?.name
																		}
																	</Typography>
																</Box>
															}
														/>
														{topic.description && (
															<MetaInfo
																description={
																	topic.description
																}
																onOverlayClose={() =>
																	setValue(
																		undefined
																	)
																}
																backButtonLabel={t(
																	'registration.topic.infoOverlay.backButtonLabel'
																)}
																nextButtonLabel={t(
																	'registration.topic.infoOverlay.nextButtonLabel'
																)}
																nextStepUrl={
																	nextStepUrl
																}
																onNextClick={
																	onNextClick
																}
																onOverlayOpen={() => {
																	setDataForSessionStorage(
																		{
																			topicId:
																				topic.id
																		}
																	);
																	setValue(
																		topic.id
																	);
																}}
															/>
														)}
													</Box>
												))}
										</AccordionDetails>
									</Accordion>
							  ))}
					</RadioGroup>
				</FormControl>
			)}
		</>
	);
};
