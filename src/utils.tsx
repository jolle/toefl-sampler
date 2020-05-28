/** @jsx jsx */
import { jsx } from '@emotion/core';

export const formatPassage = (
	rawPassage: string | Buffer,
	onDefinitionClick?: (index: number) => void,
	onBoxClick?: (index: number) => void,
	boxReplacement?: { index: number; text: string; incorrectIndex?: number }
) => {
	let passage: number[];
	if (typeof rawPassage === 'string')
		passage = rawPassage.split('').map((a) => a.charCodeAt(0));
	else passage = Array.from(rawPassage);

	const openTags: string[] = [];
	const children: JSX.Element[] = [];
	let buffer: string[] = [];

	let definitionIndex = 0;
	let boxIndex = 0;

	const pushBuffer = () => {
		children.push(
			<span key={children.length}>
				{buffer.join('').replace(/\s\|\]\s+\]\|/g, '')}
			</span>
		);
		buffer = [];
	};

	for (let i = 0; i < passage.length; i++) {
		// check if a special code has been started
		if (openTags.includes('^')) {
			// remove special code starting character as we're at the specifier now
			openTags.splice(openTags.indexOf('^'), 1);

			if (passage[i] === '6'.charCodeAt(0)) {
				// "look at this passage"
				pushBuffer();

				children.push(<span key={children.length}>⮕</span>);
			}
		} else if (passage[i] === '}'.charCodeAt(0)) {
			// title
			if (openTags.includes('}')) {
				openTags.splice(openTags.indexOf('}'), 1);

				children.push(
					<h1
						css={{
							margin: '0',
						}}
						key={children.length}
					>
						{buffer.join('')}
					</h1>
				);
				buffer = [];
			} else {
				pushBuffer();

				openTags.push('}');
			}
		} else if (passage[i] === '['.charCodeAt(0)) {
			// highlight
			if (openTags.includes('[')) {
				openTags.splice(openTags.indexOf('['), 1);

				children.push(
					<span
						css={{
							backgroundColor: '#BFBFC0',
						}}
						key={children.length}
					>
						{buffer.join('')}
					</span>
				);
				buffer = [];
			} else {
				pushBuffer();

				openTags.push('[');
			}
		} else if (passage[i] === '^'.charCodeAt(0)) {
			// start special code (action depends on the next character (specifier))
			openTags.push('^');
		} else if (passage[i] === 0xa1) {
			// definition
			if (openTags.includes('i')) {
				openTags.splice(openTags.indexOf('i'), 1);

				const index = definitionIndex++;

				children.push(
					<span
						css={{
							color: 'blue',
							textDecoration: 'underline',
							cursor: 'pointer',
						}}
						onClick={() => onDefinitionClick && onDefinitionClick(index)}
						key={children.length}
					>
						{buffer.join('')}
					</span>
				);
				buffer = [];
			} else {
				pushBuffer();

				openTags.push('i');
			}
		} else if (passage[i] === 0x0a) {
			// `\n`
			if (
				!passage[i - 1] ||
				passage[i - 1] === 0x0a ||
				!passage[i - 2] ||
				passage[i - 2] !== 0x0a
			) {
				// checks that there wasn't a line break just before (trim)
				pushBuffer();
				children.push(<div css={{ height: '10px' }} key={children.length} />);
			}
		} else if (
			String.fromCharCode(...passage.slice(i - 9, i)) === ' |]    ]|'
		) {
			pushBuffer();

			const index = boxIndex++;

			const incorrectInformation =
				boxReplacement && boxReplacement.incorrectIndex;

			if (boxReplacement && boxReplacement.index === index) {
				children.push(
					<span
						css={{
							fontSize: '14pt',
							...(typeof incorrectInformation !== 'undefined'
								? {
										color: 'green',
								  }
								: {}),
						}}
						key={children.length}
					>
						{boxReplacement.text}
					</span>
				);
			} else {
				children.push(
					<div
						css={{
							cursor:
								typeof incorrectInformation !== 'undefined'
									? 'default'
									: 'pointer',
							height: '20px',
							width: '20px',
							backgroundColor: incorrectInformation === index ? 'red' : '#000',
							display: 'inline-block',
							verticalAlign: 'middle',
						}}
						onClick={() =>
							typeof incorrectInformation === 'undefined' &&
							onBoxClick &&
							onBoxClick(index)
						}
						key={children.length}
					/>
				);
			}

			buffer.push(String.fromCharCode(passage[i]));
		} else if (passage[i] !== 0x0d) {
			// no `\r`s
			buffer.push(String.fromCharCode(passage[i]));
		}
	}

	pushBuffer();

	return <div>{...children}</div>;
};

/**
 * Returns the appropriate color for a multiple choice
 * option when checking for answers. `correctAnswerIndex`
 * signifies the actually correct answer option's index.
 * `currentAnswerIndex` signifies the option that was
 * selected by the user.
 *
 * The correct option will be green regardless of what the
 * user chose. If it was correct, no red option will be shown.
 */
export function getMultipleChoiceColor(
	index: number,
	correctAnswerIndex: number,
	currentAnswerIndex: number
): string | undefined {
	if (correctAnswerIndex === index) return 'green';
	if (currentAnswerIndex === index) return 'red';

	return undefined;
}
