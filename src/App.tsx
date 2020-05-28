/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
const { remote } = require('electron');
const fs = remote.require('fs');
import { join } from 'path';
import { Test } from './Test';
import { Container } from './components/Container';
import { Heading } from './components/Heading';
import Store from 'electron-store';
import { Header } from './components/Header';
import { HeaderButton } from './components/HeaderButton';

const store = new Store();

interface ITest {
	element: Element;
	directory?: string;
}

/**
 * Cleans the sampler XML.
 */
const processSamplerXML = (data: string, directory?: string) =>
	data
		.replace(
			/<TestItem /g,
			`</TestItem><TestItem${directory ? ` directory="${directory}"` : ''} `
		)
		.replace(/"ON /g, '" ')
		.replace(/<(\s+)/g, (_: any, m: string) => m)
		.replace(
			/<([A-Za-z]+) ([^>]+)>/g,
			(_: any, tagName: string, attributes: string) =>
				`<${tagName} ${Array.from(
					new Map(
						attributes
							.split(' ')
							.map((a) => a.split('=') as [string, string])
							.filter(([a]) => a)
							.map(([a, b]) => [a, b.startsWith('"') ? b : `"${b}"`])
					)
				)
					.map((a) => a.join('='))
					.join(' ')}>`
		)
		.replace(/ =>/g, '>') + (directory ? '' : '</TestItem>');

export function App() {
	const [currentTest, setCurrentTest] = useState<[ITest, string] | undefined>();
	const [samplerData, setSamplerData] = useState<Document>();
	const [folderPath, setFolderPath] = useState<string>();
	const [error, setError] = useState<string>();

	const previousLocations = store.get('toefl-sampler-locations');

	const openFolder = (path: string) => {
		const filesInDirectory = fs.readdirSync(path) as string[];

		let data = '<Test></Test>';

		if (filesInDirectory.includes('sampler.xml')) {
			data =
				'<Test>' +
				processSamplerXML(
					fs.readFileSync(join(path, 'sampler.xml')).toString()
				).replace(/^<\/TestItem>/, '') +
				'</Test>';
		} else {
			data = `<Test>${filesInDirectory
				.filter((f) => f.startsWith('form') && f.endsWith('.xml'))
				.map((f) =>
					processSamplerXML(
						fs.readFileSync(join(path, f)).toString(),
						f.split('.')[0]
					)
				)
				.join('\n')
				.replace(/^<\/TestItem>/, '')}</TestItem></Test>`;
		}

		store.set(
			'toefl-sampler-locations',
			[path, ...(previousLocations || [])].filter(
				(a, b, c) => c.indexOf(a) === b
			)
		);

		const parsed = new DOMParser().parseFromString(data, 'application/xml');
		if (
			parsed.querySelectorAll('TESTLET').length === 0 ||
			parsed.querySelector('parsererror')
		) {
			setError(
				(
					parsed.querySelector('parsererror > div') || {
						innerHTML: 'unknown error',
					}
				).innerHTML
			);
			return;
		}

		setSamplerData(parsed);
		setFolderPath(path);
	};

	if (!samplerData) {
		return (
			<div>
				<Header>
					<HeaderButton
						icon="×"
						onClick={() => {
							remote.getCurrentWindow().close();
						}}
					>
						Exit
					</HeaderButton>
				</Header>
				<Container>
					<Heading>Select Test Package</Heading>

					{error && (
						<div
							css={{
								textAlign: 'center',
								color: '#f00',
								fontSize: '9pt',
								marginBottom: '20px',
							}}
						>
							<strong>Failed to open test package:</strong> {error}
						</div>
					)}

					<input
						type="file"
						css={{
							margin: '0 auto',
							display: 'block',
						}}
						{...{ webkitdirectory: 'webkitdirectory' }}
						onChange={(e) =>
							openFolder(
								((e.target.files![0] as any) as {
									path: string;
								}).path
									.split('/')
									.slice(0, -1)
									.join('/')
							)
						}
					/>

					{previousLocations && previousLocations.length > 0 && (
						<div
							css={{
								marginTop: '30px',
								width: '50%',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						>
							{previousLocations.map((loc: string, i: number) => (
								<div
									key={loc}
									css={{
										padding: '8px',
										backgroundColor: i % 2 === 0 ? '#CBCACA' : '#E4E3E3',
										color: '#000',
										cursor: 'pointer',
										wordBreak: 'break-all',
									}}
									onClick={() => openFolder(loc)}
								>
									{loc}
								</div>
							))}
						</div>
					)}
				</Container>
			</div>
		);
	}

	const testsByCategory = Array.from(samplerData.querySelectorAll('TESTLET'))
		.filter(
			(item) =>
				['Reading', 'Writing', 'Speaking', 'Listening'].includes(
					item.getAttribute('LABEL')!
				) &&
				!item.innerHTML.includes('DIRECTIONS') &&
				!item.innerHTML.includes('HEADSET_ON')
		)
		.reduce(
			(p, n) => ({
				...p,
				[n.getAttribute('LABEL')!]: [
					...(p[n.getAttribute('LABEL')!] || []),
					{
						element: n,
						directory:
							(n.parentElement && n.parentElement.getAttribute('directory')) ||
							undefined,
					},
				],
			}),
			{} as {
				[category: string]: ITest[];
			}
		);

	if (currentTest)
		return (
			<Test
				files={Array.from(
					currentTest[0].element.querySelectorAll('TestItemName')
				).map((a) => a.innerHTML.trim())}
				path={
					folderPath
						? join(folderPath, currentTest[0].directory || 'forml1')
						: join(__dirname, '../src', currentTest[0].directory || 'forml1')
				}
				section={currentTest[1]}
				onExit={() => setCurrentTest(undefined)}
			/>
		);

	return (
		<div>
			<Header>
				<HeaderButton
					icon="×"
					onClick={() => {
						setSamplerData(undefined);
						setError(undefined);
						setFolderPath(undefined);
					}}
				>
					Exit
				</HeaderButton>
			</Header>
			<Container>
				<Heading>Choose Test</Heading>
				{Object.entries(testsByCategory).map(([category, elements]) => (
					<div key={category}>
						<h3>{category}</h3>
						<ul>
							{elements.map((e, i) => (
								<li
									key={`${category}-${i}`}
									onClick={() => setCurrentTest([e, category])}
									css={{
										cursor: 'pointer',
										textDecoration: 'underline',
									}}
								>
									{category} test #{i + 1}
								</li>
							))}
						</ul>
					</div>
				))}
			</Container>
		</div>
	);
}
