const fs = require('fs')
const imageProcessing = require('./imageProcessing.js')

const NUM_HASHES = 50

const args = process.argv.slice(2)

if (args.length != 1) {
  console.log('Usage: plo-compress-existing <target directory>')
  process.exit(1)
}

const directory = args[0]

try {
  const files = fs.readdirSync(directory)

  var count = 0
  for (var i = 0; i < files.length; i++) {
    const file = files[i]

    imageProcessing.processImage(directory + '/' + file, err => {
      const outOf = ++count * NUM_HASHES / files.length

      console.log((err ? 'Could not process ' : 'Processed: ') + file + ' '.repeat(NUM_HASHES))
      process.stdout.write('[' + '#'.repeat(Math.ceil(outOf)) + ' '.repeat(Math.floor(NUM_HASHES - outOf)) + '] ' + Math.ceil(outOf / NUM_HASHES * 100) +'%\r')
    }, true)
  }
} catch (err) {
  console.error('Could not read directory: ' + directory)
}
