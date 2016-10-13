karma-dirty-chai
================

  * [Chai](http://chaijs.com)
  * [Dirty-Chai](https://github.com/prodatakey/dirty-chai)

for [Karma](http://karma-runner.github.io)

Requirements
------------

This Karma plugin requires Karma `>=0.10`

Installation
------------

Install the module via npm

```sh
$ npm install --save-dev karma-dirty-chai
```

Add `dirty-chai` to the `frameworks` key in your Karma configuration:

```js
module.exports = function(config) {
  'use strict';
  config.set({
    frameworks: ['mocha', 'dirty-chai'],
    #...
  });
}
```

Usage
-----

Each of the function form assertions from dirty-chai will now available in your tests using the expect or should syntax.

