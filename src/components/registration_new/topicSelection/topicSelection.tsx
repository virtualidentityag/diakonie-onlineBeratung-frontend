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
import { VFC } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { getTopic, topicGroups } from './mockData';
import { useTranslation } from 'react-i18next';

export const TopicSelection: VFC = () => {
	const { t } = useTranslation();
	const sortedTopicGroups = topicGroups.sort((a, b) => {
		if (a.name === b.name) return 0;
		return a.name < b.name ? -1 : 1;
	});
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
					{sortedTopicGroups.map((topicGroup) => (
						<Accordion
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
									.map((id) => getTopic(id))
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
												value={topic.id}
												control={<Radio />}
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
													title={topic.description}
													arrow
												>
													<InfoIcon
														sx={{
															p: '9px',
															width: '42px',
															height: '42px'
														}}
													/>
												</Tooltip>
											)}
										</Box>
									))}
							</AccordionDetails>
						</Accordion>
					))}
				</RadioGroup>
			</FormControl>
		</>
	);
};
