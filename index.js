const os = require('os');
const path = require('path');
const process = require('process');
require('dotenv').config()

const zlib = require('zlib');

const { pipeline } = require('stream');
const {
  createReadStream,
  createWriteStream
} = require('fs');

const gzip = zlib.createGzip();
const input_path = process.env.INPUT_PATH + path.sep + process.argv[2]
const source = createReadStream(input_path);
const output_path = process.env.OUTPUT_PATH + path.sep + process.argv[2] + '.gz'
const destination = createWriteStream(output_path);

pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  });