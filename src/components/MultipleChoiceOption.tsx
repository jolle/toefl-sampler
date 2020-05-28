/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PropsWithChildren } from 'react';

export function MultipleChoiceOption({
	children,
	name,
	onChange,
	color,
	disabled = false,
	checked,
	type = 'radio',
}: PropsWithChildren<{
	name: string;
	onChange?: (checked: boolean) => void;
	color?: string;
	disabled?: boolean;
	checked: boolean;
	type?: string;
}>) {
	return (
		<label
			css={{
				display: 'flex',
				alignItems: 'center',
				marginBottom: '5px',
				cursor: disabled ? 'default' : 'pointer',
				...(disabled
					? {
							opacity: '0.75',
					  }
					: {}),
			}}
		>
			<input
				type={type}
				onChange={(e) => onChange && onChange(e.target.checked)}
				checked={checked}
				name={name}
				css={{
					display: 'none',
				}}
				disabled={disabled}
			/>
			<div
				css={{
					width: '22px',
					height: '14px',
					borderRadius: '100%',
					border: `1px solid ${color || '#000'}`,
					display: 'inline-block',
					marginRight: '5px',
					flexShrink: 0,
					...(checked || color ? { backgroundColor: color || '#000' } : {}),
				}}
			></div>
			{children}
		</label>
	);
}
