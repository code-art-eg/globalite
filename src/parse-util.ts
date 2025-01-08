const bidiMarkersRx =
	/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC38]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/g;
const dashRx =
	/[\x2D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u2E40\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D\u2212]|\uD803\uDEAD/g;
const spaceSeparatorRx = /[\x20\xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;

export function looseMatch(val: string): string {
	return val
		.replace(bidiMarkersRx, '')
		.replace(dashRx, '-')
		.replace(spaceSeparatorRx, '');
}

export function regexpEscape(str: string) {
	return str.replace(/[-[\]{}()*+?.,=!\\/^$|#]/g, '\\$&');
}

export function getStartsWithRe(str: string): RegExp {
	return new RegExp(`^${regexpEscape(looseMatch(str))}`);
}

export function getEndsWithRe(str: string): RegExp {
	return new RegExp(`${regexpEscape(looseMatch(str))}$`);
}

export function compareStringsAtIndex(
	token: string,
	input: string,
	index: number
): number | false {
	let i = 0;
	let j = index;

	while (spaceSeparatorRx.test(input[j]) || bidiMarkersRx.test(input[j])) {
		j++;
	}
	while (spaceSeparatorRx.test(token[i]) || bidiMarkersRx.test(token[i])) {
		i++;
	}

	while (i < token.length && j < input.length) {
		if (spaceSeparatorRx.test(input[j]) || bidiMarkersRx.test(input[j])) {
			j++;
			continue;
		}
		if (spaceSeparatorRx.test(token[i]) || bidiMarkersRx.test(token[i])) {
			i++;
			continue;
		}
		if (token[i].toLowerCase() !== input[j].toLowerCase()) {
			return false;
		}
		i++;
		j++;
	}

	if (i === token.length) {
		return j;
	}
	return false;
}
