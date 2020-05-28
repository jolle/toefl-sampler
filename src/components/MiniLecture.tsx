/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect } from 'react';
import { join } from 'path';

export function MiniLecture({
	question,
	path,
	onEnded,
}: {
	question: Document;
	path: string;
	onEnded?: () => void;
}) {
	const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

	const audios = Array.from(question.querySelectorAll('LectureSound')).map(
		(s) => (
			<audio
				controls={false}
				css={{
					display: 'none',
				}}
				autoPlay={true}
				src={`file://${join(path, s.innerHTML.trim())}`}
				onEnded={() => setCurrentAudioIndex(currentAudioIndex + 1)}
			></audio>
		)
	);

	const illustration = question.querySelectorAll('LecturePicture')[
		currentAudioIndex
	];

	useEffect(() => {
		if (onEnded && currentAudioIndex >= audios.length) {
			const exitTimeout = setTimeout(() => onEnded(), 2500);
			return () => clearTimeout(exitTimeout);
		}
	}, [onEnded, currentAudioIndex, audios]);

	return (
		<div
			css={
				illustration
					? {
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
					  }
					: {}
			}
		>
			{audios[currentAudioIndex]}

			{illustration && (
				<img
					src={`file://${join(path, illustration.innerHTML.trim())}`}
					alt="Listening illustration"
				/>
			)}
		</div>
	);
}
