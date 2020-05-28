/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren } from 'react';

export function Heading({ children }: PropsWithChildren<{}>) {
	return (
		<h1
			css={{
				fontFamily: '"Arial Black"',
				borderBottom: '1px solid #CBCACA',
				marginBottom: '40px',
				color: '#40403F',
			}}
		>
			{children}
		</h1>
	);
}
