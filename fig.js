const fs = require('fs/promises')

const chunk = (array, chunkSize) => Array(Math.ceil(array.length / chunkSize)).fill()
  .map((_, index) => index * chunkSize)
  .map(begin => array.slice(begin, begin + chunkSize))

const fig = async (str, font='standard.flf') => {
  const lines = font.split('\n')
  const header = lines[0].split(' ')
  const height = parseInt(header[1])
  const comments = parseInt(header[5])
  const hardblank = header[0][5]
  const characters = chunk(lines.slice(comments + 1), height)
  const result = Array(height).fill('')
  str.split('').forEach(char => {
    const code = char.charCodeAt(0)
    if (32 <= code <= 126) {
      const index = code - 32
      const add = characters[index].map(x => x.replaceAll(/(.)\1?$/g, '')).map(x => x.replaceAll(/^ /g, ''))
      add.forEach((x, i) => {
        result[i] += x.replaceAll(hardblank, ' ')
      })
    }
  })
  return result.join('\n')
}

module.exports = fig