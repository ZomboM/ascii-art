import Jimp from 'jimp'
export {default as fig} from './fig.js'

const defaultGradient = [
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

const getPixelAt = (img, x, y) =>
  Jimp.intToRGBA(img.getPixelColor(x, y))

const getLargePixel = (img, x, y, w, h, color=false) => {
  let size = w * h
  let total = 0
  let tr = 0
  let tg = 0
  let tb = 0
  img.scan(x, y, w, h, (x, y, idx) => {
    let r = img.bitmap.data[idx]
    let g = img.bitmap.data[idx + 1]
    let b = img.bitmap.data[idx + 2]
    let av = (0.21 * r + 0.72 * g + 0.07 * b)
    if (av > 255) av = 255
    total += av
    tr += r
    tg += g
    tb += b
  })
  return color ? [total / size, tr / size, tg / size, tb / size].map(x => Math.floor(x)) : total / size
}

const generateASCII = (img, w, h, color=false, gradient=defaultGradient) => {
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
      if (!color) {
        let brightness =
          getLargePixel(img, totalW, totalH, w_, h_, false)
        brightness =
          Math.floor(brightness * gradient.length / 256)
        string += gradient[brightness]
        string += gradient[brightness]
      } else {
        let data =
          getLargePixel(img, totalW, totalH, w_, h_, true)
        let brightness = data[0]
        string += `\x1b[38;2;${data[1]};${data[2]};${data[3]}m`
        brightness =
          Math.floor(brightness * gradient.length / 256)
        string += gradient[brightness]
        string += gradient[brightness]
      }
      totalW += w_
    })
    totalW = 0
    totalH += h_
    string += '\n'
  })
  return string + (color ? '\x1b[0m' : '')
}

export const ASCII = async (img_, { width, height, color=false, grad='lbg'}) => {
  let img
  if (img_ instanceof Jimp) img = img_
  else if (typeof img_ == 'string') img = await Jimp.read(img_)
  else throw new Error('Error: Image must either be a Jimp object or a string pointing to a file')
  return generateASCII(img, width, height, color, grad == 'lbg' ? [...defaultGradient].reverse() : grad == 'dbg' ? defaultGradient : grad)
}
export default ASCII
