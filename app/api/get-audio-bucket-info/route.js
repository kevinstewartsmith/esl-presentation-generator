import { Storage } from '@google-cloud/storage';
import path from 'path';
// Create a storage client
const storage = new Storage();

const directory = process.env.SERVICE_ACCOUNT_DIR
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME


const serviceFilePath = path.join(__dirname, "..", "..", "..", "..","..","..","..", directory, serviceFileName);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath; 


const bucketName = process.env.BUCKET_NAME


export const GET = async (request) =>  {
    const bucketName = process.env.BUCKET_NAME
   
  try {
    // Get the list of files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();

    // Extract file names from the list of files
    const fileNames = files.map(file => file.name);
    console.log(fileNames.length);
    // Respond with the list of file names
    //res.status(200).json({ files: fileNames });
    return new Response(JSON.stringify(fileNames), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error('Error fetching files from bucket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
