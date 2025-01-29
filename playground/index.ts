import { getMonthName } from '../src/get-month-name';

for (let i = 0; i < 12; i++) {
	console.log(getMonthName('ar-SA', i, 'long', 'islamic'));
}
