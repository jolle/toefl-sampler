/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MiniLecture } from '../components/MiniLecture';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

export function LectureQuestion({ question, path, onEnded }: QuestionTypeArgs) {
	return (
		<MiniLecture
			question={question}
			path={path}
			onEnded={() => onEnded && onEnded()}
		/>
	);
}
