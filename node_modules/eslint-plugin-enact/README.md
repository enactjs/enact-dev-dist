ESLint-plugin-Enact
===================

Enact specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-enact
```

# Configuration

Add `plugins` section and specify ESLint-plugin-Enact as a plugin.

```json
{
  "plugins": [
    "enact"
  ]
}
```

You can also specify some settings that will be shared across all the plugin rules.

```js
{
  "settings": {
    "enact": {
      "kind": "kind", // Regex for Component Factory to use, default to "kind"
      "hoc": "hoc"    // Regex for HoC Factory to use, default to "hoc"
    }
  }
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

With ESLint 1.x.x:

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

With ESLint 2.x.x or 3.x.x:

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Finally, enable all of the rules that you would like to use:

```json
  "rules": {
    "enact/kind-name": "error",
    "enact/prop-types": "error"
  }
```

# List of supported rules

* [enact/kind-name](docs/rules/display-name.md): Prevent missing `name` in a Enact component definition
* [react/prop-types](docs/rules/prop-types.md): Prevent missing props validation in a React component definition

## Other useful plugins

- React: [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)

# License
ESLint-plugin-Enact is based on work from ESLint-plugin-React and is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
ESLint-plugin-React is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

