/** @jsx jsx */
import { jsx } from '@emotion/core';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

export function FakePacedIndependentWritingQuestion({
	question,
}: QuestionTypeArgs) {
	return (
		<div>
			<p>{question.querySelector('Stem')!.innerHTML.trim()}</p>
			<textarea
				css={{
					width: '100%',
					height: '80vh',
				}}
			></textarea>
		</div>
	);
}
