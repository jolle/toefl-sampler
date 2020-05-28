/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect, useRef } from 'react';
import { join } from 'path';
import { QuestionTypeArgs } from '../QuestionTypeArgs';
import { Container } from '../components/Container';

enum SpeakingPhase {
	PREPARATION,
	RECORDING,
}

export function FakeSpeakingSamplerQuestion({
	question,
	path,
}: QuestionTypeArgs) {
	const [audioUrl, setAudioUrl] = useState('');

	const [phase, setPhase] = useState(SpeakingPhase.PREPARATION);
	const [secondsLeft, setSecondsLeft] = useState(3); //(10);

	const mediaRecorder = useRef<any>();

	async function startRecording() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		mediaRecorder.current = new (window as any).MediaRecorder(stream);
		mediaRecorder.current.start();

		const audioChunks: any[] = [];

		mediaRecorder.current.addEventListener('dataavailable', (event: any) => {
			audioChunks.push(event.data);
		});

		mediaRecorder.current.addEventListener('stop', () => {
			const audioBlob = new Blob(audioChunks);
			setAudioUrl(URL.createObjectURL(audioBlob));
		});

		setPhase(SpeakingPhase.RECORDING);
		setSecondsLeft(5); //(45);
	}

	useEffect(() => {
		if (audioUrl) return;

		const timeout = setTimeout(() => {
			if (phase == SpeakingPhase.PREPARATION) {
				if (secondsLeft === 1) {
					startRecording();
				} else {
					setSecondsLeft(secondsLeft - 1);
				}
			} else if (phase == SpeakingPhase.RECORDING) {
				if (secondsLeft === 1) {
					mediaRecorder.current.stop();
				} else {
					setSecondsLeft(secondsLeft - 1);
				}
			}
		}, 1000);

		return () => clearTimeout(timeout);
	}, [phase, secondsLeft]);

	return (
		<Container>
			{question.querySelector('Stem')!.innerHTML.trim()}

			<p>
				<b>
					{!audioUrl && phase === SpeakingPhase.PREPARATION
						? `${secondsLeft} seconds of preparation time left`
						: `Speak now! ${secondsLeft} seconds of speaking time left.`}
				</b>
			</p>

			{audioUrl && (
				<div>
					<p>YOUR ANSWER:</p>
					<audio controls={true} src={audioUrl}></audio>
					<p>EXAMPLE:</p>
					<audio
						controls={true}
						src={`file://${join(
							path,
							question.querySelector('ExampleWav')!.innerHTML.trim()
						)}`}
					></audio>
					<p>{question.querySelector('ExampleDescription')!.innerHTML}</p>
				</div>
			)}
		</Container>
	);
}
