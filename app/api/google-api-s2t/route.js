


import path from 'path';
const speech = require('@google-cloud/speech').v1p1beta1; // Import the Google Cloud Speech library.
const fs = require('fs');
import { Storage } from '@google-cloud/storage';

console.log("audio exists: " + fs.existsSync(path.join(process.cwd(), 'public', 'audio', 'eng.mp3')));
const directory = process.env.SERVICE_ACCOUNT_DIR
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME


//Service account file path
const serviceFilePath = path.join(__dirname, "..", "..", "..", "..","..","..","..", directory, serviceFileName);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath; 
console.log("Service file exists: " + fs.existsSync(serviceFilePath));

export const GET = async (request) => {
    const urlQuery = new URL(request.url)
    const name = urlQuery.searchParams.get("name")

    try {
        console.log("Begin transcription");
        const text = await transcribeAudio(name);
            
        console.log("log text");
        console.log(text);
        console.log("end log text");
           
        const wordsInfo = text[text.length - 1].alternatives[0].words
        console.log(wordsInfo);
        //console.log(JSON.stringify(text, null, 2));

        //return new Response( JSON.stringify(wordsInfo), { status: 200 })
        return new Response( JSON.stringify(text), { status: 200 })
                
    } catch (error) {
        console.log("google-api-s2t error: " + error);
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}

async function transcribeAudio(name) {
    
    const bucketName = process.env.BUCKET_NAME
    const fileName = process.env.FILE_NAME

    const storage = new Storage();
    const file = storage.bucket(bucketName).file(name);
   
    try {
        // Initialize a SpeechClient from the Google Cloud Speech library.
        const speechClient = new speech.SpeechClient();

        // Create an 'audio' object with the audio content in base64 format.
        const audio = {
            //content: audioBytes
            //content: audioName
            //uri: audioFilePathGS
            uri: file.cloudStorageURI
            //content: audioFilePathLocal
            //content: file
        };

        // Define the configuration for audio encoding, sample rate, and language code.
        const config = {
            encoding: 'MP3',   // Audio encoding (change if needed).
            sampleRateHertz: 44100, // Audio sample rate in Hertz (change if needed).
            languageCode: 'en-UK',   // Language code for the audio (change if needed).
            enableWordTimeOffsets: true,
            enableSpeakerDiarization: true,
            minSpeakerCount: 2,
            maxSpeakerCount: 3,
            model: "latest_long",
            //diarization_
        };

        // Use the SpeechClient to recognize the audio with the specified config.
        const [operation] = await speechClient.longRunningRecognize({ audio, config });

        // Wait for the operation to complete.
        const [response] = await operation.promise();
        
        // Return the transcription result.
        return response.results;
    } catch (error) {
        console.error('Error:', error);
    }
}