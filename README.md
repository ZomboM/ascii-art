# ascii-art-maker:<br>An ASCII art generator in node.js
| [Installation](#installation) | [Usage](#usage) | [Examples](#examples) |
| - | - | - |
## Installation
In the shell:<br>`$ npm install ascii-art-maker`

In your JavaScript:<br>`const ASCII = require('ascii-art-maker')`

## Usage
`ASCII.generate(image, opts)`<br>
Returns a Promise that resolves with the ASCII art.

`image` is either a Jimp object or a path to the image<br>
`opts` is an object with the following properties:<br>
| Property | Value | Description | Default |
| - | - | - | - |
| `width` | `number` | The width, in output pixels, of the output. Note that each output pixel is two characters wide, so the width in characters will be twice this value. | `64` |
| `height` | `number` | The height, in characters, of the output. | `64` |
| `grad` | `"lbg" \| "dbg" \| string[]` | The gradient used in the output. Use `'lbg'` for the default light background gradient and `'dbg'` for the default dark background. If using an array, note that it goes from darkest to lightest. | `"lbg"` |
| `color` | `boolean` | Whether or not to color the output. This uses ANSI escape codes. | `false` |
## Examples
```js
const ASCII = require('ascii-art-maker')
console.log(ASCII('./content/images/peppers.jpg', {
  width: 64, height: 64,
  grad: 'lbg',
  color: true,
}))
```
```js
const ASCII = require('ascii-art-maker')
console.log(ASCII('./content/images/lenna.jpg', {
  width: 128, height: 128,
  grad: 'dbg',
  color: false,
}))
```
