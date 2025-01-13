import { getCountries } from '../src/country-name';

getCountries('ar').forEach(country => {
	console.log(country);
});

console.log(getCountries('de').length);
