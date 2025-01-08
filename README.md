# Globalite

## About

Globalite is a simple and lightweight library for internationalization in TypeScript/JavaScript. 
It is inspired by [Globalize](https://github.com/globalizejs/globalize) but uses the built-in `Intl` object for
formatting and parsing dates, numbers, and currencies, instead of building its own formatting and parsing functions.
It also doesn't require the dependency of `cldr-data` or `cldrjs`.

It also adds support for parsing numbers in different international number systems to native JavaScript numbers, 
and has number formatting and parsing specifier strings similar to that of .NET (for example `E` for scientific notation, 
`N` for formatting with grouping separators, `cUSD` for currency using US dollars, etc.).

## Installation

You can install Globalite via npm:

```bash
npm install @code-art-eg/globalite
```
or via yarn:

```bash
yarn add @code-art-eg/globalite
```

## Usage

### Number Formatting

```typescript
import { numberFormatter } from '@code-art-eg/globalite';

const formatter = numberFormatter('en-US', 'cUSD'); // US locale, currency in US dollars

const formattedNumber = formatter(1234.56); // returns '$1,234.56'
```

### Number Parsing

```typescript
import { numberParser } from '@code-art-eg/globalite';

const parser = numberParser('de-DE', 'cEUR'); // German locale, currency in Euros

const number = parser('1.234,56€'); // returns 1234.56
```

#### Note about number parsing

The number parser returns `null` if the input string is not a valid number instead of `NaN` returned by `parseInt`
, `parseFloat` and Globalize parser. This is because `NaN` can lead to bugs in your code if you don't check for it.
I have fallen into this trap many times and encountered bugs in my projects because I didn't check for `NaN` before 
using the parsed number.So I think it's better to return `null` instead of `NaN`.
For example:

```typescript
import { numberParser } from '@code-art-eg/globalite';
const parse = numberParser('en-US');
const number = parse('abc'); // returns null

doSomethingWithNumber(number); // TypeScript compiler error

function doSomethingWithNumber(num: number) {
	// Do something with the number doesn't check if it's NaN
	console.log(num);
}
```

In the above snippet, we don't check if the number is `NaN` in `doSomethingWithNumber`, but since `parse` returns `null`, 
the TypeScript compiler will not allow calling `doSomethingWithNumber` with and passing a value that's possibly `null`.
To fix this, you can check if the number is `null` before calling `doSomethingWithNumber`:

```typescript

const number = parseInt('abc'); // returns null

if (number !== null) {
	doSomethingWithNumber(number);
}
```

### Date Formatting

```typescript
import { dateFormatter } from '@code-art-eg/globalite';

const formatter = dateFormatter('en-US', 'd'); // US locale, short date format

const formattedDate = formatter(new Date()); // returns '12/31/2021'
```

### Date Parsing

```typescript
import { dateParser } from '@code-art-eg/globalite';

const parser = dateParser('en-US', 'd'); // US locale, short date format

const date = parser('12/31/2021'); // returns a Date object
```

## Known Issues

- The library doesn't support parsing dates in different calendar systems. It only supports the Gregorian calendar.
- Parsing a date with a different time zone than the system time zone will return a date 
object with the same time zone as the system time zone and same clock time as the input date string.
For example, parsing a date string New York time at 12:00 PM, while the system time zone is Cairo time, 
returns a date object with Cairo time at 12:00 PM but should be 7:00 PM.


## Credits

I borrowed some logic from [Globalize](https://github.com/globalizejs/globalize) for the parsing functions. 
So a big thanks to the Globalize team for their work. I used their library for years, and it was a great help.

