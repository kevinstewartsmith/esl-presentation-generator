// pages/presentation-test.js
"use client"
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
// Dynamically import the PresentationDisplay component to ensure it only loads on the client side
const PresentationDisplay = dynamic(() => import('../components/PresentationDisplay'), { ssr: false });
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import AddTextBook from '../components/PresentationPrep/AddTextBook';
import ReadingContent from '@app/components/PresentationPrep/ReadingContent';
import SectionSelector from '@app/components/PresentationPrep/SectionSelector';
import PreReadingVocabSlides from '@app/components/PresentationPrep/PreReadingVocabSlides';
import PreReadingGames from '@app/components/PresentationPrep/PreReadingGames';

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

  const updateGistPage = (event, newPage) => {
    setPresData(prevState => ({
      ...prevState,
      gistReading: {
        ...prevState.gistReading,
        page: newPage
      }
    }));
    console.log(presData.gistReading.page);
  };
 const sections = [ <ReadingContent />, <SectionSelector />, <PreReadingVocabSlides />, <PreReadingGames />]
 const [sectionNumber, setSectionNumber] = useState(0)
  return (
    <div>
      <Head style={{ backgroundColor: "red"}}>
        <title style={{font:"white"}}>Reveal.js with Next.js</title>
      </Head>

      {showPresentation ? <PresentationDisplay presData={presData} /> : 
      <div style={{ backgroundColor: "white", height: "100vh", width: "100vw"}}>
        {/* <Box sx={{ width: 300 }} style={{marginTop: 50, borderRadius:10, borderColor: "gray" }}>

            <h1>Page</h1>
            <Slider defaultValue={2} aria-label="Default" valueLabelDisplay="auto" min={1} max={20} onChange={updateGistPage} />
            <h1>Time Limit</h1>
            <Slider defaultValue={2} aria-label="Default" valueLabelDisplay="auto" min={1} max={20} onChange={updateGistReadingTimeLimit} />
            <h1>{presData.gistReading.timeLimit}</h1>
            <button onClick={() => setShowPresentation(true)}>Start Presentation</button>
        </Box> */}
        <div style={{
            backgroundColor: "white",
            height: "15vh",
            display: "flex",
            alignItems: "center",
            marginLeft: 20,
        }}>
            <h1 style={{ 
                color:"orange",
                fontSize: 40,
                marginTop: 0,
                marginLeft: 20,
                marginBottom: 20,
            }}>Reading Exercise Generator</h1>
         </div>
        {/* <ReadingContent />
        <SectionSelector /> */}
        <div style={{
            backgroundColor: "white",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
           
        }}>
        {sections[sectionNumber]}
        </div>
        <button 
            onClick={() => setSectionNumber(sectionNumber + 1)} 
            style={{ 
                    color:"orange",
                    position: "fixed",
                    zIndex: 2,
                    right: 40,
                    bottom: 40,
                    fontSize: 40,
            }}>{"Next >"}</button>
              <button
                onClick={() => setSectionNumber(sectionNumber - 1)} 
                style={{ 
                    color:"orange",
                    position: "fixed",
                    zIndex: 2,
                    left: 40,
                    bottom: 40,
                    fontSize: 40,
            }}>{"< Prev"}</button>
       </div>
      }
     
    </div>
  );
};

export default PresentationTest;
