// utils/tesseract.js

//const Tesseract = require('tesseract.js');
import Tesseract from 'tesseract.js';

async function performOCR(imagePath) {
    try {
        const result = await Tesseract.recognize(imagePath, 'eng', {
            // Additional options can be added here
        });
        return result.data.text;
    } catch (error) {
        console.error('Error during OCR:', error);
        throw new Error('OCR process failed');
    }
}

module.exports = { performOCR };
