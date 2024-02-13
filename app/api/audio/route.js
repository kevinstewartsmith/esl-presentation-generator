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
  //const file = "gs://esl-presentation-generator-bucket/eng3.mp3";

  try {
    const [metadata] = await file.getMetadata();
    console.log('File metadata:', metadata);
  } catch (error) {
    console.error('Error getting file metadata:', error);
  }
}

