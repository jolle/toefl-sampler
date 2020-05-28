/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
const { remote } = require('electron');
const fs = remote.require('fs');
import { join } from 'path';
import { formatPassage, getMultipleChoiceColor } from '../utils';
import { DividedContainer } from '../components/DividedContainer';
import { MultipleChoiceOption } from '../components/MultipleChoiceOption';

export function SSMCPassageQuestion({
	question,
	path,
}: {
	question: Document;
	path: string;
}) {
	const passage: string = fs.readFileSync(
		join(path, question.querySelector('TPPassage')!.innerHTML.trim())
	);

	const [shouldCheck, setShouldCheck] = useState(false);
	const [currentAnswer, setCurrentAnswer] = useState(-1);

	const correctAnswer =
		parseInt(question.querySelector('Key')!.innerHTML.trim(), 10) - 1;

	return (
		<DividedContainer>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: question
							.querySelector('Stem')!
							.innerHTML.replace(
								/\|([^|]+)\|/,
								(_, m) => `<span css="background-color: #BFBFC0">${m}</span>`
							),
					}}
				/>
				{Array.from(
					question.querySelectorAll('Distractor_list Distractor')
				).map((d, i) => (
					<MultipleChoiceOption
						name="option"
						disabled={shouldCheck}
						onChange={() => setCurrentAnswer(i)}
						color={
							shouldCheck
								? getMultipleChoiceColor(i, correctAnswer, currentAnswer)
								: undefined
						}
						checked={currentAnswer === i}
						key={i}
					>
						{d.innerHTML.trim()}
					</MultipleChoiceOption>
				))}
				<button onClick={() => setShouldCheck(true)}>Check answer</button>
			</div>
			<div>{formatPassage(passage)}</div>
		</DividedContainer>
	);
}
