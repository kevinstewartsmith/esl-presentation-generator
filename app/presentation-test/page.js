// pages/presentation-test.js
"use client"
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
// Dynamically import the PresentationDisplay component to ensure it only loads on the client side
const PresentationDisplay = dynamic(() => import('../components/PresentationDisplay'), { ssr: false });
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
  


const PresentationTest = () => {

const [showPresentation, setShowPresentation] = useState(false);
const [presData, setPresData] = useState({
    gistReading: {
        book: 'Student Book',
        page: 23,
        title: "My Cat, the Hero",
        question: 'What is the name of Hercules\' cat?',
        timeLimit: 2
    },
    detailReading: {
        book: 'Student Book',
        page: 23,
        title: "My Cat, the Hero",
        exercises: 5,
        timeLimit: 6
    },
    gistPartnerCheck: {
        question: "What did you put for number 1?",
        answer: "I put ...",
    },
    detailPartnerCheck: {
        question: "What did you put for number 5?",
        answer: "I put ...",
    },
})

const updateGistReadingTimeLimit = (event, newTimeLimit) => {
    setPresData(prevState => ({
      ...prevState,
      gistReading: {
        ...prevState.gistReading,
        timeLimit: newTimeLimit
      }
    }));
    console.log(presData.gistReading.timeLimit);
  };


  return (
    <div>
      <Head>
        <title>Reveal.js with Next.js</title>
      </Head>

      {showPresentation ? <PresentationDisplay presData={presData} /> : 
      <Box sx={{ width: 300 }} style={{marginTop: 50}}>
        {/* <Slider
            size="small"
            defaultValue={70}
            aria-label="Small"
            valueLabelDisplay="auto"
        /> */}
        <h1>Time Limit</h1>
        <Slider defaultValue={2} aria-label="Default" valueLabelDisplay="auto" min={1} max={20} onChange={updateGistReadingTimeLimit} />
        <h1>{presData.gistReading.timeLimit}</h1>
        <button onClick={() => setShowPresentation(true)}>Start Presentation</button>
        </Box>
      }
     
    </div>
  );
};

export default PresentationTest;
