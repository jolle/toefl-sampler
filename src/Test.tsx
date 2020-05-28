/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
const { remote } = require('electron');
const fs = remote.require('fs');
import { join } from 'path';
import { HeaderButton } from './components/HeaderButton';
import { Header } from './components/Header';
import { NoQuestPassageQuestion } from './questionTypes/NoQuestPassageQuestion';
import { SSMCPassageQuestion } from './questionTypes/SSMCPassageQuestion';
import { LectureQuestion } from './questionTypes/LectureQuestion';
import { FakeSpeakingSamplerQuestion } from './questionTypes/FakeSpeakingSamplerQuestion';
import { SimpleSSMCQuestion } from './questionTypes/SimpleSSMCQuestion';
import { PacedWritingListeningQuestion } from './questionTypes/PacedWritingListeningQuestion';
import { FakePacedIndependentWritingQuestion } from './questionTypes/FakePacedIndependentWritingQuestion';
import { InsertTextPassageQuestion } from './questionTypes/InsertTextPassageQuestion';
import { DraggyQuestion } from './questionTypes/DraggyQuestion';
import { Container } from './components/Container';

const questionTypeToType = (type: string) => {
	switch (type) {
		case 'view_this_passage_noquest':
			return NoQuestPassageQuestion;
		case 'passage_ssmc':
			return SSMCPassageQuestion;
		case 'lecture':
			return LectureQuestion;
		case 'speaking_fake_sampler':
			return FakeSpeakingSamplerQuestion;
		case 'ssmc_simple':
			return SimpleSSMCQuestion;
		case 'writelisten_paced_fake':
			return PacedWritingListeningQuestion;
		case 'independentwriting_paced_fake':
			return FakePacedIndependentWritingQuestion;
		case 'passage_insertText':
			return InsertTextPassageQuestion;
		case 'draggy':
			return DraggyQuestion;
	}

	return undefined;
};

export function Test({
	path,
	files,
	section,
	onExit,
}: {
	path: string;
	files: string[];
	section: string;
	onExit?: () => void;
}) {
	const questions = files.map((filename) =>
		new DOMParser().parseFromString(
			fs.readFileSync(join(path, filename)).toString(),
			'application/xml'
		)
	);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	if (currentQuestionIndex === questions.length) {
		if (onExit) onExit();
		return <div />;
	}

	const type = questions[currentQuestionIndex]
		.querySelector('TestItem')!
		.getAttribute('CLASS')!;
	const QuestionType = questionTypeToType(type);

	return (
		<div
			css={{
				fontFamily: 'Arial',
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
			}}
		>
			<div>
				<Header>
					<HeaderButton icon="×" onClick={() => onExit && onExit()}>
						Exit
					</HeaderButton>
					<HeaderButton
						disabled={true}
						icon='<svg version="1.0" width="15px" height="15px" viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg"><path d="m39.389 13.769-17.154 14.837h-16.235v19.093h15.989l17.4 15.051v-48.981z" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="5"/><path d="m48 27.6a19.5 19.5 0 0 1 0 21.4m7.1-28.5a30 30 0 0 1 0 35.6m6.5-42.1a38.8 38.8 0 0 1 0 48.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="5"/></svg>'
					>
						Volume
					</HeaderButton>
					{section !== 'Listening' && [
						<HeaderButton
							disabled={true}
							icon='<svg version="1.1" width="15px" height="15px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m68.3 13.1h-36.6c-1.7 0-3 1.3-3 3v68.5c0 1.2 1 2.2 2.2 2.2 0.6 0 1.1-0.2 1.5-0.6l16.1-16.1c0.4-0.4 0.9-0.7 1.5-0.7s1.1 0.3 1.5 0.7l15.9 15.9c0.4 0.5 1 0.8 1.7 0.8 1.2 0 2.2-1 2.2-2.2v-68.4c0-1.7-1.3-3.1-3-3.1z" fill="currentColor"/></svg>'
							key="review-btn"
						>
							Review
						</HeaderButton>,
						<HeaderButton
							icon="⭠"
							disabled={currentQuestionIndex === 0}
							onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
							key="back-btn"
						>
							Back
						</HeaderButton>,
					]}
					<HeaderButton
						icon="⭢"
						onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
						disabled={
							// advancing to the next question is disabled if there is no more
							// questions or the question is a lecture (listening)
							currentQuestionIndex === questions.length - 1 ||
							QuestionType === LectureQuestion
						}
					>
						Next
					</HeaderButton>
				</Header>
				<div
					css={{
						padding: '8px',
						backgroundColor: '#FFFACD',
						borderTop: '1px solid #FFF27F',
					}}
				>
					<strong>{section}</strong> | Question {currentQuestionIndex + 1} of{' '}
					{questions.length}
				</div>
			</div>
			<div
				css={{
					flex: 1,
				}}
			>
				{QuestionType ? (
					<QuestionType
						key={currentQuestionIndex}
						question={questions[currentQuestionIndex]}
						path={path}
						onEnded={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
					/>
				) : (
					<Container>Unsupported question type {type}</Container>
				)}
			</div>
		</div>
	);
}
