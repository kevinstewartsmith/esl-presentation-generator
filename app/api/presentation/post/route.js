// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"
import path from 'path';
 // Import the Google Cloud Speech library.
const fs = require('fs');
const Firestore = require('@google-cloud/firestore');
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket:process.env.storageBucket ,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
//   measurementId: process.env.measurementId
// };
//console.log(firebaseConfig);




// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
//const db = getFirestore(app);

const directory = process.env.SERVICE_ACCOUNT_DIR
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME


//Service account file path
const serviceFilePath = path.join(__dirname, "..","..", "..", "..", "..","..","..","..", directory, serviceFileName);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath; 
console.log("Service file exists: " + fs.existsSync(serviceFilePath));

const firestore = new Firestore();
const collectionRef = firestore.collection('nothing');

const dummyData = {
    audio_url: "www.dummy.com",
    questions: ["question 1", "question 2"],
    text_answers:["answer 1, answer 2"],
    answer_instructions:"It's true or false",
    transcript:"blah blah blah blah",
    transcript_word_array: ["blah", "blah", "blah", "blah"],
    transcript_time_array: [{start: 0, end: 5}, {start: 5, end: 10}, {start: 10, end: 15}, {start: 15, end: 20}],
    snippets:["snippet 1", "snippet 2"],
}



export const POST = async (req, res) => {
    console.log("car");
    const { fartSound } =  await req.json();
    console.log(req.method);
    console.log(fartSound);
    //console.log(req.body)
    //console.log(req.json());
    
    

    try {
        // const docRef = await addDoc(collection(db, "users"), dummyData);
        // console.log("Document written with ID: ", docRef.id);
        //addDoc(collection(firestore, "users"), dummyData);
        const docRef = await collectionRef.add(dummyData)
        console.log('Document written with ID: ', docRef.id);
        //var collection = firebase.fireStore().collection('users');
        console.log("trying to add the doc");
        return new Response("Data added to firestore", {status: 201})
        //res.status(201).send("Data added to Firestore");
      } catch (e) {
        
        console.error("Error adding document: ", e);
        return new Response("nah")
      }
}
