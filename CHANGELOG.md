## [0.0.16](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.15...v0.0.16) (2019-07-12)


### Dependencies

* **bump:** dep base v0.0.11



## [0.0.15](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.14...v0.0.15) (2019-07-05)


### Bug Fixes

* **positioning:** bump down the z-index to 100 so it appears under popovers ([540a36e](https://github.com/rapid-build-ui/rb-nav/commit/540a36e))


### Features

* **version:** add to component properties accessible via this.version ([6fa7ec1](https://github.com/rapid-build-ui/rb-nav/commit/6fa7ec1))


### Dependencies

* **bump:** dep rb-base v0.0.10 ([a4c85a0](https://github.com/rapid-build-ui/rb-nav/commit/a4c85a0))



## [0.0.14](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.13...v0.0.14) (2019-05-09)


### Bug Fixes

* **responsive nav:** scrolling to active on menu open for firefox and safari ([2b2cfcd](https://github.com/rapid-build-ui/rb-nav/commit/2b2cfcd))


### Features

* **css variables:** add ability via css vars to uniquely style responsive trigger when closed and open ([86e129f](https://github.com/rapid-build-ui/rb-nav/commit/86e129f))
* **responsive:** add momentum scrolling on iOS ([ce8ac2d](https://github.com/rapid-build-ui/rb-nav/commit/ce8ac2d))
* **styling:** add states for css var primary-horizontal-no-dividers-link-border ([d3b4a8c](https://github.com/rapid-build-ui/rb-nav/commit/d3b4a8c))


### Dependencies

* **bump:** dep rb-base v0.0.9 ([b39fbd4](https://github.com/rapid-build-ui/rb-nav/commit/b39fbd4))



## [0.0.13](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.12...v0.0.13) (2019-03-05)


### Dependencies

* **bump:** dep rb-base v0.0.8 ([a6cbcf1](https://github.com/rapid-build-ui/rb-nav/commit/a6cbcf1))



## [0.0.12](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.11...v0.0.12) (2019-02-25)


### Bug Fixes

* **firefox:** ensure responsive navs display over succeeding navs ([b2a29de](https://github.com/rapid-build-ui/rb-nav/commit/b2a29de))
* **firefox and safari:** dividers option for default kind from not showing up ([d2dc9d1](https://github.com/rapid-build-ui/rb-nav/commit/d2dc9d1))
* **responsive:** only display nav menu over other elements when responsive and small viewport ([81734b0](https://github.com/rapid-build-ui/rb-nav/commit/81734b0))
* **responsive:** when zooming in on devices ([25bc953](https://github.com/rapid-build-ui/rb-nav/commit/25bc953))


### Features

* **css variables:** create and expose them so consumers can style rb-nav how they please ([21e52a5](https://github.com/rapid-build-ui/rb-nav/commit/21e52a5))
* **display:** set host's display to either block or inline-block so consumer can add bumpers ([34c0af8](https://github.com/rapid-build-ui/rb-nav/commit/34c0af8))
* **normalize styles:** ensure component always looks the same via setting css all property to initial ([64a21eb](https://github.com/rapid-build-ui/rb-nav/commit/64a21eb))
* **responsive scrolling:** ensure responsive nav content is always accessible via scrolling ([1e48201](https://github.com/rapid-build-ui/rb-nav/commit/1e48201))


### Dependencies

* **bump:** dep rb-base v0.0.7 ([a5fe97f](https://github.com/rapid-build-ui/rb-nav/commit/a5fe97f))


### BREAKING CHANGES

* **api option:** change inverse to dark ([fd9d850](https://github.com/rapid-build-ui/rb-nav/commit/fd9d850))

To migrate the code follow the example below:

**Before:**  
inverse

**Now:**  
dark



## [0.0.11](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.10...v0.0.11) (2018-12-05)


### Features

* **hidden attribute:** display style that respects the hidden attribute ([469349e](https://github.com/rapid-build-ui/rb-nav/commit/469349e))


### Performance Improvements

* **css:** improve browser performance by adding css contain property ([27e7816](https://github.com/rapid-build-ui/rb-nav/commit/27e7816))


### Dependencies

* **bump:** dep rb-base v0.0.6 ([f1408a4](https://github.com/rapid-build-ui/rb-nav/commit/f1408a4))



## [0.0.10](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.9...v0.0.10) (2018-11-13)


### Dependencies

* **bump:** dep rb-base v0.0.5 ([4a52331](https://github.com/rapid-build-ui/rb-nav/commit/4a52331))



## [0.0.9](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.8...v0.0.9) (2018-09-26)


### Dependencies

* **bump:** dep rb-base v0.0.4 ([58ccfa4](https://github.com/rapid-build-ui/rb-nav/commit/58ccfa4))



## [0.0.8](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.7...v0.0.8) (2018-09-14)


### Dependencies

* **rb-base:** bump to v0.0.3 ([053e714](https://github.com/rapid-build-ui/rb-nav/commit/053e714))



## [0.0.7](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.6...v0.0.7) (2018-09-05)


### Bug Fixes

* **safari:** remove border radius on nav links when primary and responsive option is enabled ([e8b8f83](https://github.com/rapid-build-ui/rb-nav/commit/e8b8f83))
* **safari:** remove extra space when dividers or responsive option is enabled ([6acb512](https://github.com/rapid-build-ui/rb-nav/commit/6acb512))


### Dependencies

* **rb-base:** bump to v0.0.2 ([4ae37b9](https://github.com/rapid-build-ui/rb-nav/commit/4ae37b9))



## [0.0.6](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.5...v0.0.6) (2018-08-30)


### Dependencies

* **rb-base:** replace deps lit-html and skatejs with @rapid-build-ui/rb-base and make corresponding updates ([8aaac5a](https://github.com/rapid-build-ui/rb-nav/commit/8aaac5a))



## [0.0.5](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.4...v0.0.5) (2018-07-11)


### Bug Fixes

* **mobile:** not closing the nav menu on clickaway ([34be703](https://github.com/rapid-build-ui/rb-nav/commit/34be703))



## [0.0.4](https://github.com/rapid-build-ui/rb-nav/compare/v0.0.3...v0.0.4) (2018-07-08)


Release switches web components library Polymer 3 to [SkateJS](http://skatejs.netlify.com/) and view renderer [lit-html](https://polymer.github.io/lit-html/).


### Bug Fixes

* **safari:** not setting the observable active link ([426fdba](https://github.com/rapid-build-ui/rb-nav/commit/426fdba))
* **safari and firefox:** not closing the responsive nav menu on window click ([426fdba](https://github.com/rapid-build-ui/rb-nav/commit/426fdba))



## 0.0.3 (2018-06-22)


### Bug Fixes

* **active segment:** support activating link with / when segment is 1 ([7a180e8](https://github.com/rapid-build-ui/rb-nav/commit/7a180e8))
* **activity:** ensure active hash always work ([5bc6298](https://github.com/rapid-build-ui/rb-nav/commit/5bc6298))
* **links:** attach events to dynamically links ([d741585](https://github.com/rapid-build-ui/rb-nav/commit/d741585))
* **nav menu postion:** ensure that it is always viewable even after window resize ([add4b3c](https://github.com/rapid-build-ui/rb-nav/commit/add4b3c))
* **spacing:** ensure hidden nav doesn't occupy any space when responsive ([5546538](https://github.com/rapid-build-ui/rb-nav/commit/5546538))
* **spacing:** prevent extra left and right spacing caused by empty text nodes ([72279c0](https://github.com/rapid-build-ui/rb-nav/commit/72279c0))
* **styling:** ensure font-size and line-height is component specific ([15dde8a](https://github.com/rapid-build-ui/rb-nav/commit/15dde8a))


