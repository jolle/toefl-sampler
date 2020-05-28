/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren, Children } from 'react';

export function DividedContainer({ children }: PropsWithChildren<{}>) {
	return (
		<div
			css={{
				width: 'fit-content',
				padding: '4px',
				paddingRight: '0',
				display: 'flex',
				border: '1px solid black',
				flex: '1 1 0px',
			}}
		>
			{Children.map(children, (child, i) => (
				<div
					key={i}
					css={{
						border: '1px solid black',
						padding: '10px',
						height: '100%',
						overflow: 'scroll',
						flexBasis: '100%',
						marginRight: '4px',
					}}
				>
					{child}
				</div>
			))}
		</div>
	);
}
