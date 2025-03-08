import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const buildPackageJsonPath = path.resolve(
	__dirname,
	'../../build/package.json'
);

const versionRx = /^v(\d+\.\d+\.\d+)(?:-(\d+)-(g[a-f0-9]+))?$/;
const version = await new Promise<string>((resolve, reject) => {
	exec('git describe --tags', {}, (error, stdout) => {
		if (error) {
			reject(error);
		} else {
			resolve(stdout.trim());
		}
	});
});

const match = version.match(versionRx);
if (!match) {
	console.error(`Invalid version: ${version}`);
	process.exit(1);
}

let actualVersion = match[1];
if (match[2]) {
	actualVersion += `-build.${match[2]}`;
}

console.log(`Version: ${version}`);

// Read the package.json file
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

// Remove scripts and devDependencies
packageJson.scripts = {};
packageJson.devDependencies = {};
packageJson.private = false;
packageJson.engines = {};

// Update the version
packageJson.version = actualVersion;

// Write the modified package.json to the build directory
await fs.writeFile(
	buildPackageJsonPath,
	JSON.stringify(packageJson, null, 2),
	'utf-8'
);
