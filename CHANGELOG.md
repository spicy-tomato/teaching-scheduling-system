# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.6.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.5.0...v2.6.0) (2022-05-06)


### Features

* remove dismissable on all dialogs ([4bb0c4f](https://github.com/annguyen-it/teaching-scheduling-system/commits/4bb0c4f5201a9225adedaa5459a1c4f6afc4810c))


### Bug Fixes

* **statistic:** break line for cell content in export file ([0961fd4](https://github.com/annguyen-it/teaching-scheduling-system/commits/0961fd4433c7fad78865b8611dd43a7c326a20bd))
* **statistic:** do not export denied schedule ([df8999c](https://github.com/annguyen-it/teaching-scheduling-system/commits/df8999cbc0e68930f1ca2c01726f4b539ca408d0))
* **user-setting:** cannot change password ([76897ae](https://github.com/annguyen-it/teaching-scheduling-system/commits/76897aeb38fdd13835a61b2e89d77921aef40c91))

## [2.5.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.4.0...v2.5.0) (2022-05-04)


### Features

* update API ([a79d9e9](https://github.com/annguyen-it/teaching-scheduling-system/commits/a79d9e9d531444d3ea85e306f9a7536ad3898c12))

## [2.4.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.3.0...v2.4.0) (2022-05-04)


### Features

* new pipe `filterByInput` ([0803b1a](https://github.com/annguyen-it/teaching-scheduling-system/commits/0803b1a1c6be366f3322758d80357539997c0909))
* remove cache mechanic ([0f0b868](https://github.com/annguyen-it/teaching-scheduling-system/commits/0f0b868dec8a123f14b05a41be92b4b2658b8166))
* remove pipe `filter` ([d7ea2bd](https://github.com/annguyen-it/teaching-scheduling-system/commits/d7ea2bdb6a5391ac8b128d2e0d106ac441eb0a4a))
* remove pipe `map` ([15e6f6a](https://github.com/annguyen-it/teaching-scheduling-system/commits/15e6f6acf25c02db71969c569e5ab046d3a93336))

## [2.3.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.2.1...v2.3.0) (2022-05-04)


### Features

* **change-schedule:** always display shift in information dialog ([9dc6949](https://github.com/annguyen-it/teaching-scheduling-system/commits/9dc6949900a0aa0efd25fc3261b65628a055198a))
* **change-schedule:** display shift information ([6486ab3](https://github.com/annguyen-it/teaching-scheduling-system/commits/6486ab31fb20e6bddcae00c7c87f59acad450861))


### Bug Fixes

* **change-schedule:** decrease margin on export file for teacher ([6b8aef5](https://github.com/annguyen-it/teaching-scheduling-system/commits/6b8aef5dda890aada2974a69a918c39aefe06d9b))
* **change-schedule:** field `teacher name` in export file is null ([547bb67](https://github.com/annguyen-it/teaching-scheduling-system/commits/547bb67ef6712220c591e716507a9996a932323e))
* disable translate ([2a768c3](https://github.com/annguyen-it/teaching-scheduling-system/commits/2a768c3da13df50a7dfa9957af9106764330e996))

### [2.2.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.2.0...v2.2.1) (2022-05-03)


### Bug Fixes

* **change-schedule:** export button content is line-break ([0c1e680](https://github.com/annguyen-it/teaching-scheduling-system/commits/0c1e680cf1fe3319cc6d02c75f4bb2660bc0ca5f))

## [2.2.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.1.2...v2.2.0) (2022-05-03)


### Features

* add pipe arrayIncludes ([c9ce6af](https://github.com/annguyen-it/teaching-scheduling-system/commits/c9ce6af08a1b5cf0e4a1080ad94647affcf25195))
* add pipe changeCanExport ([d418f93](https://github.com/annguyen-it/teaching-scheduling-system/commits/d418f93c418fe03018a41530ac9fcb556dc5d90e))
* **change-schedule:** export multiple change schedules ([3fbe95f](https://github.com/annguyen-it/teaching-scheduling-system/commits/3fbe95f299262fa1790bf6566912ceb050fc9b22))


### Bug Fixes

* fix typo in export file name ([3507578](https://github.com/annguyen-it/teaching-scheduling-system/commits/35075784908c95259d22afa0c0c7ec358bcd6efb))

### [2.1.2](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.1.1...v2.1.2) (2022-05-01)


### Bug Fixes

* **request-change:** fix disable condition for export button ([994ef2a](https://github.com/annguyen-it/teaching-scheduling-system/commits/994ef2a592e4f6f06ebc8bcbdd70c75b7b7c381f))
* **schedule:** update API ([b7b2c57](https://github.com/annguyen-it/teaching-scheduling-system/commits/b7b2c579cd40a33481e1b1ab5b6355c7ceb11e04))

### [2.1.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.1.0...v2.1.1) (2022-04-23)


### Bug Fixes

* **change-schedule:** hide field "teacher" in details dialog if data is null ([d5c18d1](https://github.com/annguyen-it/teaching-scheduling-system/commits/d5c18d11a08f23d79e3ff267e4b052623e4ba20b))

## [2.1.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.0.3...v2.1.0) (2022-04-23)


### Features

* **change-schedule:** move some information from table to details dialog ([dea8328](https://github.com/annguyen-it/teaching-scheduling-system/commits/dea832852a92e548903fd4d8b468afe89bc49e9b))

### [2.0.3](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.0.2...v2.0.3) (2022-04-22)


### Bug Fixes

* **change-schedule:** only allow export if status is 'change' or 'approve' ([66ca409](https://github.com/annguyen-it/teaching-scheduling-system/commits/66ca409f1749eb8a830601cd90b33eaa01384931))

### [2.0.2](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.0.1...v2.0.2) (2022-04-22)


### Bug Fixes

* **change-schedule:** display intend time ([9c0a6de](https://github.com/annguyen-it/teaching-scheduling-system/commits/9c0a6de9b3debe72a8c21a72018c6a6543c24fea))
* **export:** fix typo ([376cdf6](https://github.com/annguyen-it/teaching-scheduling-system/commits/376cdf69115b98f66584cd8a487282fab54c0546))
* **schedule:** details button in popup should be inline ([851069f](https://github.com/annguyen-it/teaching-scheduling-system/commits/851069f5c704b2672b676989b25ff700716d0750))

### [2.0.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v2.0.0...v2.0.1) (2022-04-20)


### Bug Fixes

* remove console.log ([181a67b](https://github.com/annguyen-it/teaching-scheduling-system/commits/181a67b3ac0a1105a5a1ff01a72d510a206d3476))

## [2.0.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.7...v2.0.0) (2022-04-19)


### ⚠ BREAKING CHANGES

* update API
* update services
* change API

### Features

* change API ([70f921f](https://github.com/annguyen-it/teaching-scheduling-system/commits/70f921f43a16012431ad8a64b4edfac4a013d344))
* update API ([db2c278](https://github.com/annguyen-it/teaching-scheduling-system/commits/db2c278d7bb007598262b82d88171badb2755402))
* update phone number ([2cf30b6](https://github.com/annguyen-it/teaching-scheduling-system/commits/2cf30b623ac17e3c559c3abacfb4ccf7eb04d2d7))
* user info ([3c909bf](https://github.com/annguyen-it/teaching-scheduling-system/commits/3c909bf168b1ed0b94b943b6381ff620af5dc010))


### Bug Fixes

* fix shiftPipe type ([a046c7a](https://github.com/annguyen-it/teaching-scheduling-system/commits/a046c7aafd6260a4acd721ceb10a3126003c8fa1))
* ui bug when login as normal teacher ([ac35028](https://github.com/annguyen-it/teaching-scheduling-system/commits/ac35028623b7da0f3faa01e2d129c5147a8b958f))
* update api ([5d903a0](https://github.com/annguyen-it/teaching-scheduling-system/commits/5d903a071b686fe314a932ba5d1ad9b6238df55d))
* update API ([ea38d48](https://github.com/annguyen-it/teaching-scheduling-system/commits/ea38d48ff37eb1a58085e9664495ad1b4d22dd50))
* update services ([99db102](https://github.com/annguyen-it/teaching-scheduling-system/commits/99db102e089d69d43e9123be239a012cbe7a7a7c))

### [1.4.7](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.6...v1.4.7) (2022-04-04)


### Bug Fixes

* schedule: change date allow request ([739c37d](https://github.com/annguyen-it/teaching-scheduling-system/commits/739c37d33cdd87bf39b449aff639d5e6c91218c0))

### [1.4.6](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.5...v1.4.6) (2022-04-04)


### Bug Fixes

* fix wrong export data ([0d9ffb9](https://github.com/annguyen-it/teaching-scheduling-system/commits/0d9ffb9b608ea99b41adb0169db30965a4007273))

### [1.4.5](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.4...v1.4.5) (2022-03-31)


### Bug Fixes

* fix style of navbar dropdown ([f5b9519](https://github.com/annguyen-it/teaching-scheduling-system/commits/f5b951988d51c70c604a6a665acdf988f6895b62))

### [1.4.4](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.3...v1.4.4) (2022-03-31)


### Bug Fixes

* change valid change schedule condition ([4ebee6e](https://github.com/annguyen-it/teaching-scheduling-system/commits/4ebee6e8a8f30f00d25512f07a9a764b690ea086))
* details text in schedule pop up is overlap ([afe5622](https://github.com/annguyen-it/teaching-scheduling-system/commits/afe562208061cdc6a9280202e3084d49fc6befb3))

### [1.4.3](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.2...v1.4.3) (2022-03-28)


### Bug Fixes

* fix minor bugs for Firefox ([4f84cf6](https://github.com/annguyen-it/teaching-scheduling-system/commits/4f84cf65f1785c3abdca9af2df8ef8699dd42a8f))

### [1.4.2](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.1...v1.4.2) (2022-03-26)


### Bug Fixes

* make time indicator bolder ([3a329af](https://github.com/annguyen-it/teaching-scheduling-system/commits/3a329af07b453f8de9d735ef85a6488b72b57e8a))

### [1.4.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.4.0...v1.4.1) (2022-03-26)


### Bug Fixes

* schedule: add background color for today cell ([f5c327c](https://github.com/annguyen-it/teaching-scheduling-system/commits/f5c327cf637ff23ffd475115bba0fec7fd437674))

## [1.4.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.3.2...v1.4.0) (2022-03-24)


### Features

* import schedule ([f1affad](https://github.com/annguyen-it/teaching-scheduling-system/commits/f1affad8974b94a2df8b8552b2b83b5becb143d0))
* remove module notification ([715156e](https://github.com/annguyen-it/teaching-scheduling-system/commits/715156eaeae91087c30a45b6bc23a7d3afde5e68))


### Bug Fixes

* migrate assign-schedule to module ([a1e6037](https://github.com/annguyen-it/teaching-scheduling-system/commits/a1e6037b2f62a2baf4a632cbe52239a4abf55228))
* page assign schedule now load data on enter ([9a5c81f](https://github.com/annguyen-it/teaching-scheduling-system/commits/9a5c81fe64eb872cbc58462c5560a02ea93d2ab7))

### [1.3.2](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.3.1...v1.3.2) (2022-03-22)


### Bug Fixes

* add label and lines to chart ([560dca1](https://github.com/annguyen-it/teaching-scheduling-system/commits/560dca18d485ffed3a5e3d8ca18faff648efca0c))
* export file for room manager ([1b83c2c](https://github.com/annguyen-it/teaching-scheduling-system/commits/1b83c2cf52e0b71f76a4f319ddc275d57f6116ca))
* export file for teacher ([25c5624](https://github.com/annguyen-it/teaching-scheduling-system/commits/25c5624a987ef0a010cc54df732630cbb072378a))
* export file for teacher ([90a054c](https://github.com/annguyen-it/teaching-scheduling-system/commits/90a054c503a83a71b5e0838aae280750b55e3f54))

### [1.3.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.3.0...v1.3.1) (2022-03-21)


### Bug Fixes

* update depedency css ([800b5ea](https://github.com/annguyen-it/teaching-scheduling-system/commits/800b5ea633f2132ceb7fe99e0779b91ae296f703))

## [1.3.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.2.1...v1.3.0) (2022-03-21)


### Features

* display checklist requirement of change schedule ([d2a4030](https://github.com/annguyen-it/teaching-scheduling-system/commits/d2a403077ad8a9552239f5513fad4bc560fec073))


### Bug Fixes

* reduce timeout for room data in local storage ([a0e2fec](https://github.com/annguyen-it/teaching-scheduling-system/commits/a0e2fec603296a05b34bc0d948a103d078e6a6a1))

### [1.2.1](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.2.0...v1.2.1) (2022-03-16)


### Bug Fixes

* edit icons of popup schedule ([4832cce](https://github.com/annguyen-it/teaching-scheduling-system/commits/4832cce581a6cfa317412ce664f59d9de74fca4b))

## [1.2.0](https://github.com/annguyen-it/teaching-scheduling-system/compare/v1.1.0...v1.2.0) (2022-03-09)


### Features

* add versionrc ([9b64a5d](https://github.com/annguyen-it/teaching-scheduling-system/commits/9b64a5d5225ae141998f024fe88fd24c18c86ed0))

## 1.1.0 (2022-03-09)


### Features

* add husky ([945d4b8](https://github.com/annguyen-it/teaching-scheduling-system/commits/945d4b83729c11e0e2b7ed6af3b9d2947cfba0b8))
* Permission directive ([bbd67dc](https://github.com/annguyen-it/teaching-scheduling-system/commits/bbd67dc8dc1dd756fa86e86b99cea8b4b433db06))


### Bug Fixes

* Call profile API twice ([6c1bdcd](https://github.com/annguyen-it/teaching-scheduling-system/commits/6c1bdcdc5eeebd555f3fcc647da310195e28c9cc))
* Cannot enter page Requests directly ([2280964](https://github.com/annguyen-it/teaching-scheduling-system/commits/22809644683a21e50342e16ad93ee25a5e09be2e))
* Cannot export my request ([2d8bd3c](https://github.com/annguyen-it/teaching-scheduling-system/commits/2d8bd3cbc1357a192680be4b1893b674d267ea10))
* Cannot get all change schedule requests ([241b37c](https://github.com/annguyen-it/teaching-scheduling-system/commits/241b37cbde7293ca065e14f539bf017182afc0f7))
* Cannot query in page assign-schedule ([0ce99c8](https://github.com/annguyen-it/teaching-scheduling-system/commits/0ce99c81ae4166a89437bf40a170f53d1aea5bf7))
* Cannot remove token on server when logout ([bcbcc6d](https://github.com/annguyen-it/teaching-scheduling-system/commits/bcbcc6d79ab16c76767d1c5071afa60d50fa85ad))
* Display wrong message when login failed ([fc0e5a3](https://github.com/annguyen-it/teaching-scheduling-system/commits/fc0e5a3538033217f5b0ce6de8006390f3551cd8))
* Do not detect schedule change after remove day ([a886e52](https://github.com/annguyen-it/teaching-scheduling-system/commits/a886e5244483c796a9192de293ddc9d46965648e))
* Do not fetch department in initial frame ([efa89fd](https://github.com/annguyen-it/teaching-scheduling-system/commits/efa89fd260d0836e3c510793caf4db7981ad72f7))
* Not trigger filter all ([374aae9](https://github.com/annguyen-it/teaching-scheduling-system/commits/374aae90b61b37d3fd08db8e56257d045020b27f))
* Permission directive creates multiple instances ([1c16df5](https://github.com/annguyen-it/teaching-scheduling-system/commits/1c16df546648b9a5b26457da56afe5959ae2ace1))
* Schedule display incorrect when navigate fast ([5229571](https://github.com/annguyen-it/teaching-scheduling-system/commits/52295712a2355a3179ce9eedb9182027c756a30b))
* Teacher name in export file is null ([2b85d15](https://github.com/annguyen-it/teaching-scheduling-system/commits/2b85d15e5646679b49453d698f7379e2336f0610))
* Wrong data state when re-login ([81ca59f](https://github.com/annguyen-it/teaching-scheduling-system/commits/81ca59fe0d87e075457965b8faf434da59c0cd10))
* Wrong fixed-schedule after re-login ([2901af6](https://github.com/annguyen-it/teaching-scheduling-system/commits/2901af6d493f092d47ba2b68a8a6bc449726cf3f))
* Wrong schedule after re-login with other account ([d95ba94](https://github.com/annguyen-it/teaching-scheduling-system/commits/d95ba947b9866a560067a9f1831decdd70e4c314))
