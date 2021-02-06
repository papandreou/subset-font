# subset-font

Create a subset font from an existing font in Truetype (.ttf), WOFF, or WOFF2 format.

```js
const subsetFont = require('subset-font');

const myTruetypeFontBuffer = Buffer.from(/*...*/);

// Create a new font with only the characters required to render "Hello, world!" in WOFF2 format:
const subsetBuffer = await subsetFont(myTruetypeFontBuffer, 'Hello, world!', {
  targetFormat: 'woff2',
});
```

## API

#### `subsetFont(buffer, text, options): Promise<Buffer>`

Asynchronously create a subset font as a Buffer instance, optionally converting it to another format.

Returns a promise that fulfills with the subset font as a Buffer instance, or rejected with an error.

Options:

- `targetFormat` - the format to output, can be either `'truetype'`, `'woff'`, or `'woff2'`.

## Releases

[Changelog](https://github.com/papandreou/subset-font/blob/master/CHANGELOG.md)

## License

3-clause BSD license -- see the `LICENSE` file for details.
