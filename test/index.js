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

  // https://github.com/papandreou/subset-font/issues/22
  describe('with an icon font', function () {
    before(async function () {
      this.materialIconsFont = await readFile(
        pathModule.resolve(
          __dirname,
          '..',
          'testdata',
          'MaterialIcons-Regular.ttf'
        )
      );
    });

    describe('without the noLayoutClosure flag', function () {
      it('should retain more glyphs', async function () {
        const result = await subsetFont(
          this.materialIconsFont,
          `_abcdefghijklmnopqrstuvwxyz0123456789${String.fromCodePoint(
            0xe5c5,
            0xe5c8
          )}`
        );

        expect(result.length, 'to be greater than', 300000);
      });
    });

    describe('with the noLayoutClosure flag', function () {
      it('should retain more glyphs', async function () {
        const result = await subsetFont(
          this.materialIconsFont,
          `_abcdefghijklmnopqrstuvwxyz0123456789${String.fromCodePoint(
            0xe5c5,
            0xe5c8
          )}`,
          {
            noLayoutClosure: true,
          }
        );

        expect(result.length, 'to be less than', 3000);
      });
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

  describe('with a variable font', function () {
    beforeEach(async function () {
      this.variableRobotoFont = await readFile(
        pathModule.resolve(
          __dirname,
          '..',
          'testdata',
          'RobotoFlex-VariableFont_GRAD,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf'
        )
      );
    });

    describe('when not instancing the font using axis pinning', function () {
      it('should include the original variation axes', async function () {
        const result = await subsetFont(this.variableRobotoFont, 'abcd');

        expect(fontkit.create(result).variationAxes, 'to satisfy', {
          wght: { name: 'wght', min: 100, default: 400, max: 1000 },
          wdth: { name: 'wdth', min: 25, default: 100, max: 151 },
          opsz: { name: 'opsz', min: 8, default: 14, max: 144 },
          GRAD: { name: 'GRAD', min: -200, default: 0, max: 150 },
          slnt: { name: 'slnt', min: -10, default: 0, max: 0 },
          XTRA: { name: 'XTRA', min: 323, default: 468, max: 603 },
          XOPQ: { name: 'XOPQ', min: 27, default: 96, max: 175 },
          YOPQ: { name: 'YOPQ', min: 25, default: 79, max: 135 },
          YTLC: { name: 'YTLC', min: 416, default: 514, max: 570 },
          YTUC: { name: 'YTUC', min: 528, default: 712, max: 760 },
          YTAS: { name: 'YTAS', min: 649, default: 750, max: 854 },
          YTDE: { name: 'YTDE', min: -305, default: -203, max: -98 },
          YTFI: { name: 'YTFI', min: 560, default: 738, max: 788 },
        });
      });
    });

    describe('when instancing the font using axis pinning', function () {
      describe('when pinning all the axes', function () {
        it('should remove the variation axes from the font', async function () {
          const result = await subsetFont(this.variableRobotoFont, 'abcd', {
            variationAxes: {
              wght: 200,
              wdth: 120,
              opsz: 80,
              GRAD: -20,
              slnt: -8,
              XTRA: 502,
              XOPQ: 101,
              YOPQ: 79,
              YTLC: 420,
              YTUC: 600,
              YTAS: 810,
              YTDE: -90,
              YTFI: 660,
            },
          });

          expect(fontkit.create(result).variationAxes, 'to equal', {});

          // When not instancing the subset font is about 29 KB
          expect(result.length, 'to be less than', 4096);
        });
      });
    });

    describe('when pinning only some of the axes', function () {
      it('should remove the pinned variation axes from the font', async function () {
        const result = await subsetFont(this.variableRobotoFont, 'abcd', {
          variationAxes: {
            wght: 200,
            wdth: 120,
            opsz: 80,
            XTRA: 502,
            XOPQ: 101,
            YOPQ: 79,
            YTLC: 420,
            YTUC: 600,
            YTAS: 810,
            YTDE: -90,
            YTFI: 660,
          },
        });

        expect(fontkit.create(result).variationAxes, 'to equal', {
          GRAD: { name: 'GRAD', min: -200, default: 0, max: 150 },
          slnt: { name: 'slnt', min: -10, default: 0, max: 0 },
        });

        // When not instancing the subset font is about 29 KB
        expect(result.length, 'to be less than', 26000);
      });
    });

    describe('when reducing the ranges of some variation axes', function () {
      it('should perform a partial instancing', async function () {
        const result = await subsetFont(this.variableRobotoFont, 'abcd', {
          variationAxes: {
            GRAD: { min: -50, max: 50, default: 25 },
            slnt: { min: -9, max: 0 },
            YTDE: { min: -100, max: -98 },
            opsz: 14,
            XTRA: 468,
            XOPQ: 96,
            YOPQ: 79,
            YTLC: 514,
            YTUC: 712,
            YTAS: 750,
            YTFI: 738,
            // Leaving out wght and wdth so that the full variation space is preserved
          },
        });

        expect(
          fontkit.create(result).variationAxes,
          'to exhaustively satisfy',
          {
            GRAD: { name: 'GRAD', min: -50, max: 50, default: 25 },
            slnt: { name: 'slnt', min: -9, max: 0, default: 0 },
            YTDE: { name: 'YTDE', min: -100, max: -98, default: -100 },
            wght: { name: 'wght', min: 100, max: 1000, default: 400 },
            wdth: { name: 'wdth', min: 25, max: 151, default: 100 },
          }
        );

        // When not instancing the subset font is about 29 KB
        expect(result.length, 'to be less than', 25000);
      });

      describe('when leaving out a min value', function () {
        it('should error', async function () {
          await expect(
            () =>
              subsetFont(this.variableRobotoFont, 'abcd', {
                variationAxes: {
                  wght: { max: 300 },
                },
              }),
            'to error',
            'wght: You must provide both a min and a max value when setting the axis range'
          );
        });
      });

      describe('when leaving out a max value', function () {
        it('should error', async function () {
          await expect(
            () =>
              subsetFont(this.variableRobotoFont, 'abcd', {
                variationAxes: {
                  wght: { min: 300 },
                },
              }),
            'to error',
            'wght: You must provide both a min and a max value when setting the axis range'
          );
        });
      });

      describe('when pinning a non-existent axis', function () {
        it('should error', async function () {
          await expect(
            () =>
              subsetFont(this.variableRobotoFont, 'abcd', {
                variationAxes: {
                  foob: 123,
                },
              }),
            'to error',
            'hb_subset_input_pin_axis_location (harfbuzz) returned zero when pinning foob to 123, indicating failure. Maybe the axis does not exist in the font?'
          );
        });
      });

      describe('when reducing the variation space of a non-existent axis', function () {
        it('should error', async function () {
          await expect(
            () =>
              subsetFont(this.variableRobotoFont, 'abcd', {
                variationAxes: {
                  foob: {
                    min: 123,
                    max: 456,
                  },
                },
              }),
            'to error',
            'hb_subset_input_set_axis_range (harfbuzz) returned zero when setting the range of foob to [123; 456] and a default value of undefined, indicating failure. Maybe the axis does not exist in the font?'
          );
        });
      });
    });
  });
});
