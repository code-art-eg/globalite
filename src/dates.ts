const localeIndependentRx = /^[oOrRsSu]$/;
export type Specifier = {
	s: string;
	localeIndependent: boolean;
	key: string;
};

export function parseDateSpecifier(
	specifier: string,
	locale: string,
	timeZone?: string
): Specifier {
	if (localeIndependentRx.test(specifier)) {
		return {
			s: specifier.toLowerCase(),
			localeIndependent: true,
			key: specifier.toLowerCase(),
		};
	}

	const key = timeZone
		? `${locale}/${specifier}/${timeZone}`
		: `${locale}/${specifier}`;

	return {
		s: specifier,
		localeIndependent: false,
		key,
	};
}

export function getOptionsFromSpecifier(
	specifier: string
): Intl.DateTimeFormatOptions {
	if (specifier === 'd') {
		return {
			dateStyle: 'short',
		};
	}

	if (specifier === 'D') {
		return {
			dateStyle: 'full',
		};
	}

	if (specifier === 'f') {
		return {
			dateStyle: 'full',
			timeStyle: 'short',
		};
	}

	if (specifier === 'F' || specifier === 'U') {
		return {
			dateStyle: 'full',
			timeStyle: 'medium',
		};
	}

	if (specifier === 'g') {
		return {
			dateStyle: 'short',
			timeStyle: 'short',
		};
	}

	if (specifier === 'G') {
		return {
			dateStyle: 'short',
			timeStyle: 'medium',
		};
	}

	if (specifier === 'M' || specifier === 'm') {
		return {
			month: 'long',
			day: 'numeric',
		};
	}

	if (specifier === 'T') {
		return {
			timeStyle: 'medium',
		};
	}

	if (specifier === 't') {
		return {
			timeStyle: 'short',
		};
	}

	if (specifier === 'Y') {
		return {
			year: 'numeric',
			month: 'long',
		};
	}

	throw new Error(`Invalid date time format specifier: ${specifier}`);
}
