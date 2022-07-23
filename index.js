/* global WebAssembly */
const { readFile } = require('fs').promises;
const _ = require('lodash');
const fontverter = require('fontverter');

const loadAndInitializeHarfbuzz = _.once(async () => {
  const {
    instance: { exports },
  } = await WebAssembly.instantiate(
    await readFile(require.resolve('harfbuzzjs/hb-subset.wasm'))
  );

  const heapu8 = new Uint8Array(exports.memory.buffer);
  return [exports, heapu8];
});

async function subsetFont(
  originalFont,
  text,
  { targetFormat = fontverter.detectFormat(originalFont), preserveNameIds } = {}
) {
  if (typeof text !== 'string') {
    throw new Error('The subset text must be given as a string');
  }

  const [exports, heapu8] = await loadAndInitializeHarfbuzz();

  originalFont = await fontverter.convert(originalFont, 'truetype');

  const input = exports.hb_subset_input_create_or_fail();
  if (input === 0) {
    throw new Error(
      'hb_subset_input_create_or_fail (harfbuzz) returned zero, indicating failure'
    );
  }

  const fontBuffer = exports.malloc(originalFont.byteLength);
  heapu8.set(new Uint8Array(originalFont), fontBuffer);

  // Create the face
  const blob = exports.hb_blob_create(
    fontBuffer,
    originalFont.byteLength,
    2, // HB_MEMORY_MODE_WRITABLE
    0,
    0
  );
  const face = exports.hb_face_create(blob, 0);
  exports.hb_blob_destroy(blob);

  // Do the equivalent of --font-features=*
  const layoutFeatures = exports.hb_subset_input_set(
    input,
    6 // HB_SUBSET_SETS_LAYOUT_FEATURE_TAG
  );
  exports.hb_set_clear(layoutFeatures);
  exports.hb_set_invert(layoutFeatures);

  if (preserveNameIds) {
    const inputNameIds = exports.hb_subset_input_set(
      input,
      4 // HB_SUBSET_SETS_NAME_ID
    );
    for (const nameId of preserveNameIds) {
      exports.hb_set_add(inputNameIds, nameId);
    }
  }

  // Add unicodes indices
  const inputUnicodes = exports.hb_subset_input_unicode_set(input);
  for (const c of text) {
    exports.hb_set_add(inputUnicodes, c.codePointAt(0));
  }

  let subset;
  try {
    subset = exports.hb_subset_or_fail(face, input);
    if (subset === 0) {
      exports.hb_face_destroy(face);
      exports.free(fontBuffer);
      throw new Error(
        'hb_subset_or_fail (harfbuzz) returned zero, indicating failure. Maybe the input file is corrupted?'
      );
    }
  } finally {
    // Clean up
    exports.hb_subset_input_destroy(input);
  }

  // Get result blob
  const result = exports.hb_face_reference_blob(subset);

  const offset = exports.hb_blob_get_data(result, 0);
  const subsetByteLength = exports.hb_blob_get_length(result);
  if (subsetByteLength === 0) {
    exports.hb_blob_destroy(result);
    exports.hb_face_destroy(subset);
    exports.hb_face_destroy(face);
    exports.free(fontBuffer);
    throw new Error(
      'Failed to create subset font, maybe the input file is corrupted?'
    );
  }

  const subsetFont = Buffer.from(
    heapu8.subarray(offset, offset + subsetByteLength)
  );

  // Clean up
  exports.hb_blob_destroy(result);
  exports.hb_face_destroy(subset);
  exports.hb_face_destroy(face);
  exports.free(fontBuffer);

  return await fontverter.convert(subsetFont, targetFormat, 'truetype');
}

const limiter = require('p-limit')(1);
module.exports = (...args) => limiter(() => subsetFont(...args));
