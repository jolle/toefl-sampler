/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import { join } from 'path';
import { MultipleChoiceOption } from '../components/MultipleChoiceOption';
import headset from '../headset.jpg';
import { MiniLecture } from '../components/MiniLecture';
import { QuestionTypeArgs } from '../QuestionTypeArgs';
import { getMultipleChoiceColor } from '../utils';

export function SimpleSSMCQuestion({ question, path }: QuestionTypeArgs) {
	const [shouldCheck, setShouldCheck] = useState(false);
	const [currentAnswer, setCurrentAnswer] = useState(-1);
	const [showOptions, setShowOptions] = useState(false);
	const [hasDoneExtraStep, setHasDoneExtraStep] = useState(
		question.querySelector('StupidAudioFile') === null
	);

	const correctAnswer =
		parseInt(question.querySelector('Key')!.innerHTML.trim(), 10) - 1;

	const [hasMiniLecture, setHasMinilecture] = useState(
		question.querySelector('miniLecture') !== null
	);

	return (
		<div
			css={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			{!hasMiniLecture && !showOptions && (
				<audio
					autoPlay={true}
					css={{
						display: 'none',
					}}
					src={`file://${join(
						path,
						question.querySelector('StemWav')!.innerHTML.trim()
					)}`}
					onEnded={() => setShowOptions(true)}
				></audio>
			)}
			{!hasMiniLecture && (
				<p>
					{question.querySelector('Stem')!.innerHTML.trim()}
					{question.querySelector('StupidAudioFile') && (
						<img
							src={headset}
							alt="Icon of a headset"
							css={{
								verticalAlign: 'middle',
								marginLeft: '8px',
							}}
						/>
					)}
				</p>
			)}
			{hasMiniLecture && !showOptions && question.querySelector('miniLecture') && (
				<div
					css={{
						display: 'none',
					}}
				>
					<MiniLecture
						question={question.querySelector('miniLecture')! as any}
						path={path}
						onEnded={() => setHasMinilecture(false)}
					/>
				</div>
			)}
			{showOptions && question.querySelector('StupidAudioFile') && (
				<audio
					controls={false}
					css={{
						display: 'none',
					}}
					autoPlay={true}
					onEnded={() => setHasDoneExtraStep(true)}
					src={`file://${join(
						path,
						question.querySelector('StupidAudioFile')!.innerHTML.trim()
					)}`}
				></audio>
			)}

			<div
				css={{
					visibility: showOptions && hasDoneExtraStep ? 'visible' : 'hidden',
				}}
			>
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
					>
						{d.innerHTML.trim()}
					</MultipleChoiceOption>
				))}
				<button onClick={() => setShouldCheck(true)}>Check answer</button>
			</div>
		</div>
	);
}
