const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const subsetFont = require('..');
const fs = require('fs')
const pathModule = require('path')


const ttfFont = fs.readFileSync(
  pathModule.resolve(__dirname, '..', 'testdata', 'FZZJ-ZSXKJW.ttf')
)

suite
  .add('subset ttf to ttf', {
    'defer': true,
    'fn': function(deferred) {
      subsetFont(
        ttfFont,
        `To:送你「难兄难弟纪念」心意卡，这是我送你的第张心意卡，一起继续加油鸭！`
      ).then(() => {
        deferred.resolve();
      })
    }
  })
  .add('subset ttf to woff2', {
    'defer': true,
    'fn': function(deferred) {
      subsetFont(
        ttfFont,
        `To:送你「难兄难弟纪念」心意卡，这是我送你的第张心意卡，一起继续加油鸭！`,
        { targetFormat: 'woff2' }
      ).then(() => {
        deferred.resolve();
      })
    }
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log(`Fastest is ${  this.filter('fastest').map('name')}`);
  })
  // run async
  .run({ 'async': true });