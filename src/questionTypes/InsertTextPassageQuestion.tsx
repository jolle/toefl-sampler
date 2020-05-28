/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
const { remote } = require('electron');
const fs = remote.require('fs');
import { join } from 'path';
import { formatPassage } from '../utils';
import { DividedContainer } from '../components/DividedContainer';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

const INSERT_BLOCK_HTML =
	'<div style="width: 20px; height: 20px; background-color: #000; display: inline-block; vertical-align: middle"></div>';

export function InsertTextPassageQuestion({
	question,
	path,
}: QuestionTypeArgs) {
	const passage: string = fs.readFileSync(
		join(path, question.querySelector('TPPassage')!.innerHTML.trim())
	);

	const [shouldCheck, setShouldCheck] = useState(false);
	const [currentAnswer, setCurrentAnswer] = useState(-1);

	const correctAnswer =
		parseInt(question.querySelector('Key')!.innerHTML.trim(), 10) - 1;

	const distractor = question.querySelector('Distractor_list Distractor')!
		.innerHTML;

	return (
		<DividedContainer>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: question
							.querySelector('Stem')!
							// passage insertion blocks
							.innerHTML.replace(/\[ \|   \| \]/g, () => INSERT_BLOCK_HTML)
							.replace(
								/\|([^|]+)\|/,
								(_, m) => `<span style="background-color: #BFBFC0">${m}</span>`
							),
					}}
				/>
				<p
					css={{
						paddingLeft: '10px',
						fontSize: '13pt',
					}}
				>
					{distractor}
				</p>
				<button onClick={() => setShouldCheck(true)}>Check answer</button>
			</div>
			<div>
				{formatPassage(
					passage,
					undefined,
					(index) => {
						setCurrentAnswer(index);
					},
					currentAnswer >= 0
						? {
								index: shouldCheck ? correctAnswer - 1 : currentAnswer,
								text: distractor,
								incorrectIndex:
									shouldCheck && currentAnswer + 1 !== correctAnswer
										? currentAnswer
										: undefined,
						  }
						: undefined
				)}
			</div>
		</DividedContainer>
	);
}
