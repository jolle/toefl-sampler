/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren } from 'react';

export function Container({ children }: PropsWithChildren<{}>) {
	return (
		<div
			css={{
				marginTop: '30px',
				width: '70%',
				marginLeft: 'auto',
				marginRight: 'auto',
			}}
		>
			{children}
		</div>
	);
}
