# subset-font

Create a subset font from an existing font in SFNT (TrueType/OpenType), WOFF, or WOFF2 format. Uses [`harfbuzzjs`](https://github.com/harfbuzz/harfbuzzjs), which is a WebAssembly build of [HarfBuzz](https://harfbuzz.github.io/).

```js
const subsetFont = require('subset-font');

const mySfntFontBuffer = Buffer.from(/*...*/);

// Create a new font with only the characters required to render "Hello, world!" in WOFF2 format:
const subsetBuffer = await subsetFont(mySfntFontBuffer, 'Hello, world!', {
  targetFormat: 'woff2',
});
```

## API

#### `subsetFont(buffer, text, options): Promise<Buffer>`

Asynchronously create a subset font as a Buffer instance, optionally converting it to another format.

Returns a promise that gets fulfilled with the subset font as a Buffer instance, or rejected with an error.

Options:

- `targetFormat` - the format to output, can be either `'sfnt'`, `'woff'`, or `'woff2'`.

For backwards compatibility reasons, `'truetype'` is supported as an alias for `'sfnt'`.

## Why not use harfbuzzjs directly?

This middle-man module only really exists for convenience.

- `harfbuzzjs` is deliberately low-level bindings for HarfBuzz. While very flexible, it means that you need a series of hard-to-get-right incantations to move data in and out of the WebAssembly heap and carry out a subsetting operation. See [harfbuzz/harfbuzzjs#9](https://github.com/harfbuzz/harfbuzzjs/issues/9).
- The subsetting routines in HarfBuzz only support the SFNT (TrueType/OpenType) format. `subset-font` adds support for reading and writing WOFF and WOFF2 via the [`fontverter`](https://github.com/papandreou/fontverter) library.

## Releases

[Changelog](https://github.com/papandreou/subset-font/blob/master/CHANGELOG.md)

## License

3-clause BSD license -- see the `LICENSE` file for details.
