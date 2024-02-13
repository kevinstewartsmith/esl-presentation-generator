import fs from 'fs';
import path from 'path';

const mp3Parser = require('mp3-parser');

const audioFilePath = path.join(__dirname, "..","..","..","..","..","public","audio","eng.mp3")
console.log("audio path: " + audioFilePath);
console.log("audio exists: " + fs.existsSync(audioFilePath))
console.log("audio exists: " + fs.existsSync(audioFilePath));
const buffer = fs.readFileSync(audioFilePath);
const mp3Info = mp3Parser.readHeader(buffer);
console.log('Audio Format:', mp3Info.audioFormat);
