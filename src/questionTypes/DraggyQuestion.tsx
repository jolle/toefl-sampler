/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import { MultipleChoiceOption } from '../components/MultipleChoiceOption';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

const pluck = (array: any[], element: any) => {
	const newArray = [];
	for (let current of array) {
		if (current !== element) newArray.push(current);
	}
	return newArray;
};

export function DraggyQuestion({ question }: QuestionTypeArgs) {
	const key = question
		.querySelector('specialShowAnswer')!
		.innerHTML.split(',')
		.filter((a) => a.length > 0)
		.map((a) => parseInt(a, 10))
		.slice(0, 3);

	const [selected, setSelected] = useState<number[]>([]);
	const [error, setError] = useState<string>();
	const [shouldCheck, setShouldCheck] = useState(false);

	return (
		<div
			css={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				css={{
					width: '70%',
				}}
			>
				<p>Select {key.length} options that summarize the passage.</p>
				<p
					css={{
						color: 'red',
					}}
				>
					{error}
				</p>
				{Array.from(question.querySelectorAll('tpObject_list > tpObject')).map(
					(object, i) => (
						<MultipleChoiceOption
							type="checkbox"
							checked={selected.indexOf(i) > -1}
							onChange={(checked) =>
								checked
									? setSelected([...selected, i])
									: setSelected(pluck(selected, i))
							}
							name={object.innerHTML}
							color={
								(shouldCheck &&
									((key.includes(i + 1) && 'green') ||
										(selected.includes(i) && 'red'))) ||
								undefined
							}
							disabled={shouldCheck}
							key={i}
						>
							{object.innerHTML.split(',').slice(4).join(',')}
						</MultipleChoiceOption>
					)
				)}
				<button
					onClick={() => {
						if (selected.length !== key.length) {
							return setError(`There must be exactly ${key.length} answers.`);
						}

						setError('');
						setShouldCheck(true);
					}}
				>
					Check answer
				</button>
			</div>
		</div>
	);
}
