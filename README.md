# subset-font

Create a subset font from an existing font in SFNT (TrueType/OpenType), WOFF, or WOFF2 format. When subsetting a variable font, you can also reduce the variation space at the individual axis level.

These operations are implemented using [`harfbuzzjs`](https://github.com/harfbuzz/harfbuzzjs), which is a WebAssembly build of [HarfBuzz](https://harfbuzz.github.io/).

## Basic example

```js
const subsetFont = require('subset-font');

const mySfntFontBuffer = Buffer.from(/*...*/);

// Create a new font with only the characters required to render "Hello, world!" in WOFF2 format:
const subsetBuffer = await subsetFont(mySfntFontBuffer, 'Hello, world!', {
  targetFormat: 'woff2',
});
```

## Reducing the variation space

```js
const subsetFont = require('subset-font');

const mySfntFontBuffer = Buffer.from(/*...*/);

// Create a new font with only the characters required to render "Hello, world!" in WOFF2 format:
const subsetBuffer = await subsetFont(mySfntFontBuffer, 'Hello, world!', {
  targetFormat: 'woff2',
  variationAxes: {
    // Pin the axis to 200:
    wght: 200,
    // Reduce the variation space, explicitly setting a new default value:
    GRAD: { min: -50, max: 50, default: 25 },
    // Reduce the variation space. A new default value will be inferred by clamping the old default to the new range:
    slnt: { min: -9, max: 0 },
    // The remaining axes will be kept as-is
  },
});
```

## API

#### `subsetFont(buffer, text, options): Promise<Buffer>`

Asynchronously create a subset font as a Buffer instance, optionally converting it to another format.

Returns a promise that gets fulfilled with the subset font as a Buffer instance, or rejected with an error.

Options:

- `targetFormat` - the format to output, can be either `'sfnt'`, `'woff'`, or `'woff2'`.
- `preserveNameIds` - an array of numbers specifying the extra name ids to preserve in the `name` table. By default the harfbuzz subsetter drops most of these. Use case described [here](https://github.com/papandreou/subset-font/issues/7).
- `variationAxes` - an object specifying a full or partial instancing of variation axes in the font. Only works with variable fonts. See the example above.
- `noLayoutClosure` - don't perform glyph closure for layout substitution (GSUB). Equivalent to `hb-subset --no-layout-closure` and `pyftsubset --no-layout-closure`.

For backwards compatibility reasons, `'truetype'` is supported as an alias for `'sfnt'`.

## Why not use harfbuzzjs directly?

This middle-man module only really exists for convenience.

- `harfbuzzjs` is deliberately low-level bindings for HarfBuzz. While very flexible, it means that you need a series of hard-to-get-right incantations to move data in and out of the WebAssembly heap and carry out a subsetting operation. See [harfbuzz/harfbuzzjs#9](https://github.com/harfbuzz/harfbuzzjs/issues/9).
- The subsetting routines in HarfBuzz only support the SFNT (TrueType/OpenType) format. `subset-font` adds support for reading and writing WOFF and WOFF2 via the [`fontverter`](https://github.com/papandreou/fontverter) library.

## Releases

[Changelog](https://github.com/papandreou/subset-font/blob/master/CHANGELOG.md)

## License

3-clause BSD license -- see the `LICENSE` file for details.
