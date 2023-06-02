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
	FormControl
} from '@mui/material';
import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { getTopic, topicGroups } from './mockData';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../../../globalState';

export const TopicSelection = () => {
	const {
		setDisabledNextButton,
		setDataForSessionStorage,
		sessionStorageRegistrationData
	} = useContext(RegistrationContext);
	const { t: translate } = useTranslation();
	const [value, setValue] = useState<number>(
		sessionStorageRegistrationData.topicId || undefined
	);
	const sortedTopicGroups = topicGroups.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	useEffect(() => {
		if (value) {
			setDisabledNextButton(false);
		}
	}, [value]);

	return (
		<>
			<Typography variant="h3">
				{translate('registration.topic.headline')}
			</Typography>
			<Typography sx={{ mt: '16px', mb: '24px' }}>
				{translate('registration.topic.subline')}
			</Typography>
			<FormControl sx={{ width: '100%' }}>
				<RadioGroup aria-label="topic-selection" name="topic-selection">
					{sortedTopicGroups.map((topicGroup) => {
						return (
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
										'& .Mui-expanded': {
											my: '12px'
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
										.sort((a, b) => {
											const topicA = getTopic(a);
											const topicB = getTopic(b);
											if (topicA.name < topicB.name) {
												return -1;
											}
											if (topicA.name > topicB.name) {
												return 1;
											}
											return 0;
										})
										.map((topicId, index) => {
											const topic = getTopic(topicId);
											return (
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
														value={topic.id}
														control={
															<Radio
																onClick={() => {
																	setValue(
																		topic.id
																	);
																	setDataForSessionStorage(
																		{
																			topicId:
																				topic.id
																		}
																	);
																}}
																checked={
																	value ===
																	topic.id
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
																	{topic.name}
																</Typography>
															</Box>
														}
													/>{' '}
													{topic.description && (
														<Tooltip
															title={
																topic.description
															}
															arrow
														>
															<InfoIcon
																sx={{
																	p: '9px',
																	width: '42px',
																	height: '42px'
																}}
															></InfoIcon>
														</Tooltip>
													)}
												</Box>
											);
										})}
								</AccordionDetails>
							</Accordion>
						);
					})}
				</RadioGroup>
			</FormControl>
		</>
	);
};
