import * as React from 'react';
import { useContext } from 'react';
import { ToolsContext } from '../../globalState';
import { Box } from '../box/Box';
import { Headline } from '../headline/Headline';
import { Tool } from './Tool';
import './tools.styles';
import { useTranslation } from 'react-i18next';

export const ToolsList = () => {
	const { t: translate } = useTranslation();
	const { tools } = useContext(ToolsContext);

	return (
		<div className="toolsList__wrapper">
			<div className="toolsList__header">
				<Headline
					text={translate('navigation.tools')}
					semanticLevel="2"
					className="toolsList__header__title"
				/>
			</div>
			<div className="toolsList__innerWrapper">
				<div className="toolsList__content">
					{tools &&
						tools
							.filter((tool) => tool.sharedWithAdviceSeeker)
							.map((tool) => (
								<div
									className="toolsList__content__tool"
									key={tool.title}
								>
									<Box>
										<Tool
											title={tool.title}
											description={tool.description}
											buttonLink={tool.url}
											shared={tool.sharedWithConsultant}
										/>
									</Box>
								</div>
							))}
				</div>
			</div>
		</div>
	);
};
