/** @jsx jsx */
import { jsx } from '@emotion/core';
const { remote } = require('electron');
const fs = remote.require('fs');
import { join } from 'path';
import { formatPassage } from '../utils';
import { DividedContainer } from '../components/DividedContainer';
import { QuestionTypeArgs } from '../QuestionTypeArgs';

export function NoQuestPassageQuestion({ question, path }: QuestionTypeArgs) {
	return (
		<DividedContainer>
			<div></div>
			<div>
				{formatPassage(
					fs.readFileSync(
						join(path, question.querySelector('TPPassage')!.innerHTML.trim())
					)
				)}
			</div>
		</DividedContainer>
	);
}
