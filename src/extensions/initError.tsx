import React from 'react';
import { render } from 'react-dom';
import { Error } from '../components/error/Error';
import { config } from './resources/scripts/config';

render(<Error config={config} />, document.getElementById('errorRoot'));
