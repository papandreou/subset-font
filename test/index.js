const fontkit = require('fontkit');
const expect = require('unexpected')
  .clone()
  .addAssertion(
    '<Buffer> [not] to include name field <string>',
    async (expect, fontBuffer, fieldName) => {
      expect.errorMode = 'nested';
      expect(
        fontkit.create(fontBuffer).name.records,
        '[not] to have property',
        fieldName
      );
    }
  )
  .addAssertion(
    '<Buffer> [not] to include code point <number>',
    async (expect, fontBuffer, codePoint) => {
      expect.errorMode = 'nested';
      expect(
        fontkit.create(fontBuffer).characterSet,
        '[not] to contain',
        codePoint
      );
    }
  )
  .addAssertion(
    '<Buffer> [not] to include chunks <string+>',
    async (expect, fontBuffer, ...chunkNames) => {
      expect.errorMode = 'nested';
      expect(
        Object.keys(fontkit.create(fontBuffer).directory.tables),
        '[not] to contain ',
        ...chunkNames
      );
    }
  );
const subsetFont = require('..');
const fontverter = require('fontverter');
const { readFile } = require('fs').promises;
const pathModule = require('path');

describe('subset-font', function () {
  describe('with a truetype font', function () {
    before(async function () {
      this.sfntFont = await readFile(
        pathModule.resolve(__dirname, '..', 'testdata', 'OpenSans.ttf')
      );
    });

    describe('when not supplying the subset text as a string', function () {
      it('should fail with an error', async function () {
        await expect(
          () => subsetFont(this.sfntFont, ['f', 'o', 'o']),
          'to error with',
          'The subset text must be given as a string'
        );
      });
    });

    describe('with no targetFormat given', function () {
      it('should return the subset as truetype', async function () {
        const result = await subsetFont(this.sfntFont, 'abcd');

        expect(result, 'to be a', 'Buffer');
        expect(result.length, 'to be less than', this.sfntFont.length);
        expect(fontverter.detectFormat(result), 'to equal', 'sfnt');
      });
    });

    it('should produce a subset as ttf', async function () {
      const result = await subsetFont(this.sfntFont, 'abcd', {
        targetFormat: 'truetype',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.sfntFont.length);
      expect(fontverter.detectFormat(result), 'to equal', 'sfnt');
    });

    it('should produce a subset as woff', async function () {
      const result = await subsetFont(this.sfntFont, 'abcd', {
        targetFormat: 'woff',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.sfntFont.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOFF');
    });

    it('should produce a subset as woff2', async function () {
      const result = await subsetFont(this.sfntFont, 'abcd', {
        targetFormat: 'woff2',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.sfntFont.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOF2');
    });

    describe('when not preserving any name ids', function () {
      it('should not preserve name id 14', async function () {
        const result = await subsetFont(this.sfntFont, 'abcd');
        await expect(result, 'not to include name field', 'licenseURL');
      });
    });

    describe('when preserving only name id 14', function () {
      before(async function () {
        this.result = await subsetFont(this.sfntFont, 'abcd', {
          preserveNameIds: [14],
        });
      });

      it('should preserve name id 14', async function () {
        await expect(this.result, 'to include name field', 'licenseURL');
      });
    });

    // https://github.com/papandreou/subset-font/issues/15
    it('should handle surrogate pairs', async function () {
      const emojiFont = await readFile(
        pathModule.resolve(__dirname, '..', 'testdata', 'emoji.ttf')
      );
      const result = await subsetFont(emojiFont, '\u{1d11e}'); // aka '\ud834\udd1e'
      await expect(result, 'to include code point', 0x1d11e);
    });
  });

  describe('with a woff font', function () {
    before(async function () {
      this.woffFont = await readFile(
        pathModule.resolve(
          __dirname,
          '..',
          'testdata',
          'k3k702ZOKiLJc3WVjuplzHhCUOGz7vYGh680lGh-uXM.woff'
        )
      );
    });

    describe('with no targetFormat given', function () {
      it('should return the subset as woff', async function () {
        const result = await subsetFont(this.woffFont, 'abcd');

        expect(result, 'to be a', 'Buffer');
        expect(result.length, 'to be less than', this.woffFont.length);
        expect(result.slice(0, 4).toString(), 'to equal', 'wOFF');
      });
    });

    it('should produce a subset as ttf', async function () {
      const result = await subsetFont(this.woffFont, 'abcd', {
        targetFormat: 'truetype',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woffFont.length);
      expect(fontverter.detectFormat(result), 'to equal', 'sfnt');
    });

    it('should produce a subset as woff', async function () {
      const result = await subsetFont(this.woffFont, 'abcd', {
        targetFormat: 'woff',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woffFont.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOFF');
    });

    it('should produce a subset as woff2', async function () {
      const result = await subsetFont(this.woffFont, 'abcd', {
        targetFormat: 'woff2',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woffFont.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOF2');
    });
  });

  describe('with a woff2 font', function () {
    before(async function () {
      this.woff2Font = await readFile(
        pathModule.resolve(__dirname, '..', 'testdata', 'Roboto-400.woff2')
      );
    });

    describe('with no targetFormat given', function () {
      it('should return the subset as woff2', async function () {
        const result = await subsetFont(this.woff2Font, 'abcd');

        expect(result, 'to be a', 'Buffer');
        expect(result.length, 'to be less than', this.woff2Font.length);
        expect(result.slice(0, 4).toString(), 'to equal', 'wOF2');
      });
    });

    it('should produce a subset as ttf', async function () {
      const result = await subsetFont(this.woff2Font, 'abcd', {
        targetFormat: 'truetype',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woff2Font.length);
      expect(
        result.slice(0, 4).toString('ascii'),
        'to equal',
        '\x00\x01\x00\x00'
      );
    });

    it('should produce a subset as woff', async function () {
      const result = await subsetFont(this.woff2Font, 'abcd', {
        targetFormat: 'woff',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woff2Font.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOFF');
    });

    it('should produce a subset as woff2', async function () {
      const result = await subsetFont(this.woff2Font, 'abcd', {
        targetFormat: 'woff2',
      });

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.woff2Font.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'wOF2');
    });
  });

  describe('with a huge OTF font', function () {
    before(async function () {
      this.hugeOtfFont = await readFile(
        pathModule.resolve(
          __dirname,
          '..',
          'testdata',
          'SourceHanSerifCN-SemiBold.otf'
        )
      );
    });

    it('should not crash when subsetting', async function () {
      const result = await subsetFont(this.hugeOtfFont, 'abcd');

      expect(result, 'to be a', 'Buffer');
      expect(result.length, 'to be less than', this.hugeOtfFont.length);
      expect(result.slice(0, 4).toString(), 'to equal', 'OTTO');
      await expect(result, 'to include code point', 'a'.charCodeAt(0));
    });
  });

  describe('with a truncated font', function () {
    before(async function () {
      this.truncatedTtfFont = (
        await readFile(
          pathModule.resolve(__dirname, '..', 'testdata', 'FZZJ-ZSXKJW.ttf')
        )
      ).slice(0, 131072);
    });

    it('should error out', async function () {
      await expect(
        subsetFont(this.truncatedTtfFont, 'abcd', {
          targetFormat: 'woff',
        }),
        'to be rejected with',
        'hb_subset_or_fail (harfbuzz) returned zero, indicating failure. Maybe the input file is corrupted?'
      );
    });
  });

  describe('when omitting or preserving tables from the subsetted font', function () {
    beforeEach(async function () {
      // This font file contains these tables:
      //   Feat, GDEF, GPOS, GSUB, Glat, Gloc, OS/2, Silf, Sill, cmap, glyf, head, hhea, hmtx, loca, maxp, name, post
      this.paduakBookFont = await readFile(
        pathModule.resolve(
          __dirname,
          '..',
          'testdata',
          'PadaukBook-Regular.ttf'
        )
      );
    });

    describe('with default options', function () {
      it('should include the (subsetted) standard tables used by web browsers', async function () {
        const result = await subsetFont(this.paduakBookFont, 'abcd');

        await expect(
          result,
          'to include chunks',
          'GDEF',
          'GPOS',
          'GSUB',
          'OS/2',
          'cmap',
          'glyf',
          'head',
          'hhea',
          'hmtx',
          'loca',
          'maxp',
          'name',
          'post'
        ).and(
          'not to include chunks',
          'DSIG',
          'BASE',
          'Feat',
          'Glat',
          'Gloc',
          'Silf',
          'Sill'
        );
      });
    });
  });
});
