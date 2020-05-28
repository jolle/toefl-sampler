/** @jsx jsx */
import { jsx } from '@emotion/core';
import ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.render(
	<div
		css={{
			fontFamily: 'Arial',
		}}
	>
		<App />
	</div>,
	document.getElementById('root')
);
