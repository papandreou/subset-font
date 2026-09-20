/* global WebAssembly */
const { readFile } = require('fs').promises;
const fontverter = require('fontverter');

function once(fn) {
  let result;
  return (...args) => {
    if (!result) {
      result = { value: fn(...args) };
    }
    return result.value;
  };
}

const loadAndInitializeHarfbuzz = once(async () => {
  const {
    instance: { exports: harfbuzzJsWasm },
  } = await WebAssembly.instantiate(
    await readFile(require.resolve('harfbuzzjs/dist/harfbuzz-subset.wasm'))
  );

  harfbuzzJsWasm._initialize();

  return harfbuzzJsWasm;
});

const HB_MEMORY_MODE_WRITABLE = 2;
const HB_SUBSET_SETS_DROP_TABLE_TAG = 3;
const HB_SUBSET_SETS_NAME_ID = 4;
const HB_SUBSET_SETS_LAYOUT_FEATURE_TAG = 6;
const HB_SUBSET_FLAGS_NO_HINTING = 0x00000001;
const HB_SUBSET_FLAGS_GLYPH_NAMES = 0x00000080;
const HB_SUBSET_FLAGS_NO_LAYOUT_CLOSURE = 0x00000200;

function HB_TAG(str) {
  return str.split('').reduce(function (a, ch) {
    return (a << 8) + ch.charCodeAt(0);
  }, 0);
}

async function subsetFont(
  originalFont,
  text,
  {
    targetFormat = fontverter.detectFormat(originalFont),
    preserveNameIds,
    keepFeatures,
    variationAxes,
    noLayoutClosure,
    glyphNames,
    noHinting,
    dropTables,
    keepAllGlyphs = false,
  } = {}
) {
  if (keepAllGlyphs) {
    if (text !== undefined && text !== null && text !== '') {
      throw new Error(
        'The subset text must not be given when keepAllGlyphs is true'
      );
    }
  } else if (typeof text !== 'string') {
    throw new Error('The subset text must be given as a string');
  }

  if (
    keepFeatures !== undefined &&
    (!Array.isArray(keepFeatures) ||
      keepFeatures.some(
        (feature) =>
          typeof feature !== 'string' || !/^[\x20-\x7e]{4}$/.test(feature)
      ))
  ) {
    throw new Error(
      'keepFeatures must be an array of four-character OpenType feature tags'
    );
  }

  if (
    dropTables &&
    (!Array.isArray(dropTables) ||
      !dropTables.every((tag) => typeof tag === 'string' && tag.length === 4))
  ) {
    throw new Error('dropTables must be an array of four-character strings');
  }

  const harfbuzzJsWasm = await loadAndInitializeHarfbuzz();

  // The wasm memory can grow while subsetting, which detaches any previously
  // created view, so take a fresh one at each point of use.
  function getHeapu8() {
    return new Uint8Array(harfbuzzJsWasm.memory.buffer);
  }

  originalFont = await fontverter.convert(originalFont, 'truetype');

  const input = harfbuzzJsWasm.hb_subset_input_create_or_fail();
  if (input === 0) {
    throw new Error(
      'hb_subset_input_create_or_fail (harfbuzz) returned zero, indicating failure'
    );
  }

  const fontBuffer = harfbuzzJsWasm.malloc(originalFont.byteLength);
  getHeapu8().set(new Uint8Array(originalFont), fontBuffer);

  // Create the face
  const blob = harfbuzzJsWasm.hb_blob_create(
    fontBuffer,
    originalFont.byteLength,
    HB_MEMORY_MODE_WRITABLE,
    0,
    0
  );
  const face = harfbuzzJsWasm.hb_face_create(blob, 0);
  harfbuzzJsWasm.hb_blob_destroy(blob);

  // Do the equivalent of --layout-features=*, unless an explicit allowlist was supplied.
  const layoutFeatures = harfbuzzJsWasm.hb_subset_input_set(
    input,
    HB_SUBSET_SETS_LAYOUT_FEATURE_TAG
  );
  harfbuzzJsWasm.hb_set_clear(layoutFeatures);
  if (keepFeatures === undefined) {
    harfbuzzJsWasm.hb_set_invert(layoutFeatures);
  } else {
    for (const feature of keepFeatures) {
      harfbuzzJsWasm.hb_set_add(layoutFeatures, HB_TAG(feature));
    }
  }

  if (preserveNameIds) {
    const inputNameIds = harfbuzzJsWasm.hb_subset_input_set(
      input,
      HB_SUBSET_SETS_NAME_ID
    );
    for (const nameId of preserveNameIds) {
      harfbuzzJsWasm.hb_set_add(inputNameIds, nameId);
    }
  }

  if (noLayoutClosure || noHinting || glyphNames) {
    let flags = harfbuzzJsWasm.hb_subset_input_get_flags(input);
    if (noLayoutClosure) {
      flags |= HB_SUBSET_FLAGS_NO_LAYOUT_CLOSURE;
    }
    if (noHinting) {
      flags |= HB_SUBSET_FLAGS_NO_HINTING;
    }
    if (glyphNames) {
      flags |= HB_SUBSET_FLAGS_GLYPH_NAMES;
    }
    if (flags !== harfbuzzJsWasm.hb_subset_input_get_flags(input)) {
      harfbuzzJsWasm.hb_subset_input_set_flags(input, flags);
    }
  }

  if (dropTables) {
    const inputDropTables = harfbuzzJsWasm.hb_subset_input_set(
      input,
      HB_SUBSET_SETS_DROP_TABLE_TAG
    );
    for (const tag of dropTables) {
      harfbuzzJsWasm.hb_set_add(inputDropTables, HB_TAG(tag));
    }
  }

  // Add unicodes indices
  const inputUnicodes = harfbuzzJsWasm.hb_subset_input_unicode_set(input);
  if (keepAllGlyphs) {
    // Do the equivalent of --gids=*
    harfbuzzJsWasm.hb_set_clear(inputUnicodes);
    harfbuzzJsWasm.hb_set_invert(inputUnicodes);
  } else {
    for (const c of text) {
      harfbuzzJsWasm.hb_set_add(inputUnicodes, c.codePointAt(0));
    }
  }

  if (variationAxes) {
    for (const [axisName, value] of Object.entries(variationAxes)) {
      if (typeof value === 'number') {
        // Simple case: Pin/instance the variation axis to a single value
        if (
          !harfbuzzJsWasm.hb_subset_input_pin_axis_location(
            input,
            face,
            HB_TAG(axisName),
            value
          )
        ) {
          harfbuzzJsWasm.hb_face_destroy(face);
          harfbuzzJsWasm.free(fontBuffer);
          throw new Error(
            `hb_subset_input_pin_axis_location (harfbuzz) returned zero when pinning ${axisName} to ${value}, indicating failure. Maybe the axis does not exist in the font?`
          );
        }
      } else if (value && typeof value === 'object') {
        // Complex case: Reduce the variation space of the axis
        if (
          typeof value.min === 'undefined' ||
          typeof value.max === 'undefined'
        ) {
          harfbuzzJsWasm.hb_face_destroy(face);
          harfbuzzJsWasm.free(fontBuffer);
          throw new Error(
            `${axisName}: You must provide both a min and a max value when setting the axis range`
          );
        }
        if (
          !harfbuzzJsWasm.hb_subset_input_set_axis_range(
            input,
            face,
            HB_TAG(axisName),
            value.min,
            value.max,
            // An explicit NaN makes harfbuzz use the existing default value, clamping to the new range if necessary
            value.default ?? NaN
          )
        ) {
          harfbuzzJsWasm.hb_face_destroy(face);
          harfbuzzJsWasm.free(fontBuffer);
          throw new Error(
            `hb_subset_input_set_axis_range (harfbuzz) returned zero when setting the range of ${axisName} to [${value.min}; ${value.max}] and a default value of ${value.default}, indicating failure. Maybe the axis does not exist in the font?`
          );
        }
      }
    }
  }

  let subset;
  try {
    subset = harfbuzzJsWasm.hb_subset_or_fail(face, input);
    if (subset === 0) {
      harfbuzzJsWasm.hb_face_destroy(face);
      harfbuzzJsWasm.free(fontBuffer);
      throw new Error(
        'hb_subset_or_fail (harfbuzz) returned zero, indicating failure. Maybe the input file is corrupted?'
      );
    }
  } finally {
    // Clean up
    harfbuzzJsWasm.hb_subset_input_destroy(input);
  }

  // Get result blob
  const result = harfbuzzJsWasm.hb_face_reference_blob(subset);

  const offset = harfbuzzJsWasm.hb_blob_get_data(result, 0);
  const subsetByteLength = harfbuzzJsWasm.hb_blob_get_length(result);
  if (subsetByteLength === 0) {
    harfbuzzJsWasm.hb_blob_destroy(result);
    harfbuzzJsWasm.hb_face_destroy(subset);
    harfbuzzJsWasm.hb_face_destroy(face);
    harfbuzzJsWasm.free(fontBuffer);
    throw new Error(
      'Failed to create subset font, maybe the input file is corrupted?'
    );
  }

  const subsetFont = Buffer.from(
    getHeapu8().subarray(offset, offset + subsetByteLength)
  );

  // Clean up
  harfbuzzJsWasm.hb_blob_destroy(result);
  harfbuzzJsWasm.hb_face_destroy(subset);
  harfbuzzJsWasm.hb_face_destroy(face);
  harfbuzzJsWasm.free(fontBuffer);

  return await fontverter.convert(subsetFont, targetFormat, 'truetype');
}

const limiter = require('p-limit')(1);
module.exports = (...args) => limiter(() => subsetFont(...args));
