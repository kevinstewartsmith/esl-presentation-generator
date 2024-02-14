import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

const directory = process.env.SERVICE_ACCOUNT_DIR
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME


const serviceFilePath = path.join(__dirname, "..", "..", "..", "..","..","..","..", directory, serviceFileName);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath; 


const bucketName = process.env.BUCKET_NAME
const fileName = process.env.FILE_NAME


export const GET = async (request) =>  {
  const storage = new Storage();
  const file = storage.bucket(bucketName).file(fileName);
  

  try {
    const audioBuffer = await fetchAudioFromBucket(file);
    // const [metadata] = await file.getMetadata();
    // console.log('File metadata:', metadata);

    //return new Response("Response from audio fetch", { status: 200, headers: { "Content-Type": "application/json" } });
    return new Response(audioBuffer, { status: 200, headers: { "Content-Type": "audio/mp3" } });
  } catch (error) {
    console.error('Error getting audio:', error);
    return new Response(error);
  }
}

async function fetchAudioFromBucket(file) {
  try {
    const fileData = await file.download()
    const audioBuffer = fileData[0]
    return audioBuffer
  } catch (error) {
    console.error('Error fetching audio from bucket:', error);
    throw error;
  }
  
}

