/** @jsx jsx */
import { jsx } from '@emotion/core';
import { formatPassage } from '../utils';
import { MiniLecture } from '../components/MiniLecture';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

export function PacedWritingListeningQuestion({
	question,
	path,
}: QuestionTypeArgs) {
	return (
		<div>
			<h4>Passage</h4>
			<div>
				{formatPassage(
					question.querySelector('miniPassage miniPassageText')!.innerHTML
				)}
			</div>
			<MiniLecture
				path={path}
				question={question.querySelector('miniLecture') as any}
			></MiniLecture>
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
