import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

type PosixMessages = {
	yesstr: string;
	nostr: string;
};

type PosixData = {
	identity: {
		language: string;
	};
	posix: {
		messages: PosixMessages;
	};
};

type MainLocaleData = {
	main: Record<string, PosixData>;
};
async function main() {
	const folder = path.join(
		__dirname,
		'..',
		'..',
		'node_modules',
		'cldr-misc-full',
		'main'
	);

	const locales = fs.readdirSync(folder).sort();

	const data: Record<string, string> = {};

	for (const locale of locales) {
		const fileName = path.join(folder, locale, 'posix.json');
		const json = fs.readFileSync(fileName, {
			encoding: 'utf-8',
		});
		const content: MainLocaleData = JSON.parse(json);
		const messages = content.main[locale].posix.messages;
		const val = `${messages.yesstr.split(':')[0]}:${messages.nostr.split(':')[0]}`;
		if (val === 'yes:no') {
			continue;
		}
		let index = locale.indexOf('-');
		if (index > 0) {
			index = locale.lastIndexOf('-');
			let key = locale.substring(0, index);
			if (data[key] === undefined) {
				index = key.indexOf('-');
				if (index > 0) {
					key = key.substring(0, index);
				}
			}

			if (data[key] !== val) {
				data[locale] = val;
			}
		} else {
			data[locale] = val;
		}
	}

	const prettierOptions =
		(await prettier.resolveConfig(
			path.join(__dirname, '..', '..', 'src', 'locales')
		)) || {};
	prettierOptions.parser = 'typescript';

	const content = `// noinspection SpellCheckingInspection

const BOOLEAN_DATA: Record<string, string> = ${JSON.stringify(data, null, 2)};

export default BOOLEAN_DATA;
`;
	const formattedContent = await prettier.format(content, prettierOptions);

	const targetFile = path.join(
		__dirname,
		'..',
		'..',
		'src',
		'boolean-data.ts'
	);

	fs.writeFileSync(targetFile, formattedContent, { encoding: 'utf-8' });
}

await main();
