const Jimp = require('jimp')

const gradient = [
  ' ',
  '.',
  ':',
  '-',
  '*',
  '=',
  '+',
  '%',
  '#',
  '@',
]
gradient.reverse()

const getPixelAt = (img, x, y) =>
  Jimp.intToRGBA(img.getPixelColor(x, y))

const getLargePixel = (img, x, y, w, h) => {
  let size = w * h
  let total = 0
  img.scan(x, y, w, h, (x, y, idx) => {
    let r = img.bitmap.data[idx]
    let g = img.bitmap.data[idx + 1]
    let b = img.bitmap.data[idx + 2]
    let a = (img.bitmap.data[idx + 3] != undefined) ? img.bitmap.data[idx + 3] : 255
    let av = (0.21 * r + 0.72 * g + 0.07 * b) + 255 - a
    if (av > 255) av = 255
    total += av
  })
  return total / size
}

const generateASCII = (img, w, h) => {
  let imgW = img.bitmap.width
  let imgH = img.bitmap.height
  let widths = Array(w).fill(null)
  let heights = Array(h).fill(null)
  if (imgW / w % 1 == 0) widths.fill(imgW / w)
  else {
    let d = w - (imgW % w)
    widths = widths.map((_, i) =>
      (i < d) ? Math.floor(imgW/w) : Math.ceil(imgW/w))
  }
  if (imgH / h % 1 == 0) heights.fill(imgH / h)
  else {
    let d = h - (imgH % h)
    heights = heights.map((_, i) =>
      i < d ? Math.floor(imgH/h) : Math.ceil(imgH/h))
  }
  let totalW = 0
  let totalH = 0
  let string = ''
  heights.forEach((h_, i) => {
    widths.forEach((w_, j) => {
      let brightness =
        getLargePixel(img, totalW, totalH, w_, h_)
      totalW += w_
      brightness =
        Math.floor(brightness * gradient.length / 256)
      string += gradient[brightness]
      string += gradient[brightness]
    })
    totalW = 0
    totalH += h_
    string += '\n'
  })
  return string
}

class ASCII {
  constructor(gradient_=gradient) {
    this.gradient = gradient_
  }
  async generate(img_, width=32, height=32) {
    let img
    if (img_ instanceof Jimp) img = img_
    else if (typeof img_ == 'string') img = await Jimp.read(img_)
    else throw new Error('Error: Image must either be a Jimp object or a string pointing to a file')
    return generateAscii(img, width, height)
  }
}
