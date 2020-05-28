/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren } from 'react';

export function HeaderButton({
	children,
	icon,
	disabled = false,
	onClick,
}: PropsWithChildren<{
	icon: string;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>) {
	return (
		<button
			css={{
				fontFamily: 'Arial',
				borderBottom: '1px solid #CBCACA',
				color: '#fff',
				padding: '0px',
				textAlign: 'center',
				paddingRight: '12px',
				paddingLeft: '12px',
				border: '1px solid #fff',
				borderRadius: '3px',
				outline: 'none',
				WebkitAppearance: 'none',
				backgroundColor: '#385480',
				background: 'linear-gradient(to bottom, #45669a 0%,#385480 100%)',
				fontSize: '11pt',
				height: '44px',
				marginTop: '5px',
				cursor: 'pointer',
				display: 'inline-block',
				paddingTop: '5px',
				marginLeft: '5px',
				...(disabled
					? {
							backgroundColor: 'transparent',
							opacity: '0.6',
							cursor: 'default',
					  }
					: {}),
			}}
			onClick={(e) => !disabled && onClick && onClick(e)}
		>
			{children}
			<div
				css={{
					opacity: '0.8',
					fontSize: '16pt',
					lineHeight: '20px',
				}}
				dangerouslySetInnerHTML={{ __html: icon }}
			/>
		</button>
	);
}
