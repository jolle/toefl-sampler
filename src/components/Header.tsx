/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren } from 'react';

export function Header({ children }: PropsWithChildren<{}>) {
	return (
		<header
			css={{
				backgroundColor: '#3A3736',
				paddingLeft: '20px',
				paddingRight: '5px',
				color: '#fff',
				height: '55px',
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			<div
				css={{
					fontWeight: 'bold',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				TOEFL Unofficial Sampler Practice Test
			</div>
			<div>{children}</div>
		</header>
	);
}
