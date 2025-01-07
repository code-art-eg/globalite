import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const buildPackageJsonPath = path.resolve(
	__dirname,
	'../../build/package.json'
);

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Remove scripts and devDependencies
packageJson.scripts = {};
packageJson.devDependencies = {};
packageJson.private = false;
packageJson.engines = {};

// Write the modified package.json to the build directory
fs.writeFileSync(
	buildPackageJsonPath,
	JSON.stringify(packageJson, null, 2),
	'utf-8'
);
