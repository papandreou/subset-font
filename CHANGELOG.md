### v2.1.0 (2023-04-06)

#### Pull requests

- [#21](https://github.com/papandreou/subset-font/pull/21) Add support for instancing variable fonts \(pinning variation axes\) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

#### Commits to master

- [Update harfbuzzjs to ^0.3.2](https://github.com/papandreou/subset-font/commit/9fb043c2bba16ba26978c4c42a980c26a2f3f428) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v2.0.0 (2022-12-18)

- [Upgrade to Ubuntu 22.04](https://github.com/papandreou/subset-font/commit/0714132362ad499979dae4571aa03884d513cec1) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Revert "Revert "Update harfbuzzjs to ^0.3.1""](https://github.com/papandreou/subset-font/commit/b526500cdbfbbfaab6bb68092b3db0fdd6f00d97) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Drop node.js 10 and 12 support, add 16 and 18](https://github.com/papandreou/subset-font/commit/b276f036429681193b6b2b8f79478a9b7fab40ff) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.7.1 (2022-12-18)

- [Revert "Update harfbuzzjs to ^0.3.1"](https://github.com/papandreou/subset-font/commit/c3c5cb98fb11b137d3d8162128dd3a1789ecfca4) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.7.0 (2022-12-18)

- [Update harfbuzzjs to ^0.3.1](https://github.com/papandreou/subset-font/commit/27a4863063e633d4bbc3d3339b5fc0cfcb61927b) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Test that we strip tables not required by web browsers](https://github.com/papandreou/subset-font/commit/e90889e7e5d3f3373c076399a523e87fd4c2e8c2) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.6.1 (2022-07-30)

- [Revert "Don't limit to a concurrency of 1 now that harfbuzzjs auto-grows the wasm heap"](https://github.com/papandreou/subset-font/commit/b5461276536239cf865122dae67b1fbdf067e1ae) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.6.0 (2022-07-30)

- [Don't limit to a concurrency of 1 now that harfbuzzjs auto-grows the wasm heap](https://github.com/papandreou/subset-font/commit/e09399546948a49cba9702fb29108b607b74bd7b) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.5.0 (2022-07-24)

- [Update harfbuzzjs to ^0.3.0](https://github.com/papandreou/subset-font/commit/d38cb12bc204f63213c63a8e9217c64429379419) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Remove the memory.grow hack now that harfbuzzjs uses Emscripten and automatically grows the heap](https://github.com/papandreou/subset-font/commit/0bf5d7ab7ab2df35e863a944ebf1d87f91f777b3) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [hb-subset.wasm moved to the root of the harfbuzzjs package](https://github.com/papandreou/subset-font/commit/72ff88a4479a3a23d0d0a29d3102c2fbb2aa0b7f) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [Add a regression test with a huge font from Munter\/subfont\#145](https://github.com/papandreou/subset-font/commit/8a4667271239f415f84ef48633e6ca13d3456eb2) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [Fix CHANGELOG generation in preversion script now that an npm env var changed](https://github.com/papandreou/subset-font/commit/66a7ae5586a3a26380805297abc31b1176a9bb9c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [+1 more](https://github.com/papandreou/subset-font/compare/v1.4.0...v1.5.0)

### v1.4.0 (2021-11-10)

- [#13](https://github.com/papandreou/subset-font/pull/13) Update harfbuzzjs to ^0.2.0 \(harfbuzz 3.0.0\) ([Andreas Lind](mailto:andreas.lind@workday.com), [Andreas Lind](mailto:andreas.lind@workday.com), [Andreas Lind](mailto:andreas.lind@workday.com), [Andreas Lind](mailto:andreas.lind@workday.com), [Andreas Lind](mailto:andreaslindpetersen@gmail.com), [Andreas Lind](mailto:andreaslindpetersen@gmail.com), [Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.3.3 (2021-07-04)

- [#10](https://github.com/papandreou/subset-font/pull/10) declare lodash as a prod dep ([alsotang](mailto:alsotang@gmail.com))

### v1.3.2 (2021-07-02)

#### Pull requests

- [#9](https://github.com/papandreou/subset-font/pull/9) destroy hb\_face correctly ([alsotang](mailto:alsotang@gmail.com))

#### Commits to master

- [Truncate the now complete FZZJ-ZSXKJW.ttf in the test](https://github.com/papandreou/subset-font/commit/1b9d00675ad2d3001b99512e7193fd012284363e) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.3.1 (2021-07-02)

- [Add vscode debugger launch config](https://github.com/papandreou/subset-font/commit/12b89ce1226a8622adca1acd4c29d8260f0ab8e2) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Add a small bit of error handling, copied from hb-subset](https://github.com/papandreou/subset-font/commit/72b5b99c2190d9b81d5eb99a69f086e3a436d9b0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Error out if the text isn't given as a string](https://github.com/papandreou/subset-font/commit/f4a5297780289e69a695cbd3158eff667ec7b971) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

### v1.3.0 (2021-07-01)

- [Mention the preserveNameIds option in the README](https://github.com/papandreou/subset-font/commit/ef2a8b2fddcc4f1245119a6eca010d3436375e4f) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [Use fontkit to look for the presence of a licenseURL in the tests, avoiding ttx](https://github.com/papandreou/subset-font/commit/4e97447a86d6b0f52cd510e7fa4c34e5fea856ef) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [Implement support for a preserveNameIds array](https://github.com/papandreou/subset-font/commit/00816d7821cd6bdaa01be909d93ec93c3f81fa36) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.2.3 (2021-05-17)

- [Increase the WebAssembly heap size to accommodate larger fonts](https://github.com/papandreou/subset-font/commit/3dfc48a77264673668e34000877082819c37ce75) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.2.2 (2021-05-03)

- [#5](https://github.com/papandreou/subset-font/pull/5) Update harfbuzzjs version and remove manual layout subset enable ([Ebrahim Byagowi](mailto:ebrahim@gnu.org))

### v1.2.1 (2021-05-03)

- [#4](https://github.com/papandreou/subset-font/pull/4) Simplify characters iteration ([ebraminio](mailto:ebrahim@gnu.org))

### v1.2.0 (2021-04-20)

- [Call it sfnt instead of truetype](https://github.com/papandreou/subset-font/commit/bb581a20f44617f2fa32a73c92a6f3aba438b4e4) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.1.3 (2021-04-15)

#### Pull requests

- [#2](https://github.com/papandreou/subset-font/pull/2) Fix a leak, handle non-BMP characters and performance tweaks ([Ebrahim Byagowi](mailto:ebrahim@gnu.org), [Ebrahim Byagowi](mailto:ebrahim@gnu.org), [Ebrahim Byagowi](mailto:ebrahim@gnu.org), [Ebrahim Byagowi](mailto:ebrahim@gnu.org))

#### Commits to master

- [Use for...of without reintroducing the bug](https://github.com/papandreou/subset-font/commit/84ac1955987f5197b0f037d6cf0dde1622d73397) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.1.2 (2021-04-14)

- [Free the original fontBuffer after subsetting](https://github.com/papandreou/subset-font/commit/1170630a1cb3be4a5279facc75cecfd5220ede1f) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.1.1 (2021-04-09)

- [Update harfbuzzjs to ^0.1.4](https://github.com/papandreou/subset-font/commit/cafa582138a368129d674113b2be18000f9274e3) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [Revert "Switch to a harfbuzzjs fork with a newer build"](https://github.com/papandreou/subset-font/commit/0f2509c908c7aa1e7d4b069bda336e5c08f13de6) ([Andreas Lind](mailto:andreas.lind@workday.com))

### v1.1.0 (2021-04-09)

- [Switch to a harfbuzzjs fork with a newer build](https://github.com/papandreou/subset-font/commit/78995cf5daf9c2dfdc5d14b3e919e1bd17b5d0e0) ([Andreas Lind](mailto:andreas.lind@workday.com))
- [More README](https://github.com/papandreou/subset-font/commit/32e03b8862452717b00487b899d0faf9b73e3138) ([Andreas Lind](mailto:andreas.lind@peakon.com))

### v1.0.0 (2021-02-06)

- [Initial commit](https://github.com/papandreou/subset-font/commit/4b4d722bf9ac9604fd4a9002b7c7c2a0ff025d82) ([Andreas Lind](mailto:andreas.lind@peakon.com))
