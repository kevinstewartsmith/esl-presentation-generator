import React, { useState, useContext } from 'react'
import { Grid } from '@mui/material'
import { lightBlue } from '@mui/material/colors'
import { PresentationContext } from '@app/contexts/PresentationContext'

const PreReadingVocabSlides = () => {
    const words = ['Carpet', 'Dolphin', 'Rubbish', 'Sequence']
    
    const { textTranscript, vocabulary, updateVocabulary } = useContext(PresentationContext);

    //const extractedText = "David Have you got ready for the party? Joanna No, ? is ready. We haven't found ? to have it, for a start. We've looked : . David Have you invited ® yet? Joanna Yes, we've invited 50 people and s is coming! David So you've got 50 people coming, but ) for them to come to? Joanna That's right. David Well, we've got to do ® ‘ How about using my house? Joanna What about your parents? David They won't mind. They're going > forthe weekend. I'll make sure ™ is clean and tidy when they get home."


    
    async function getVocabulary() {
        try {
            const response = await fetch(`/api/get-vocabulary-chatgpt?query=${textTranscript}&cefr_level=a2`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            let data = await response.text(); // Assuming the server returns JSON
            
            console.log('Raw response data:', data); // Log raw data

        // Preprocess the string to remove newline characters and spaces
        const cleanedData = data.replace(/(\r\n|\n|\r)/gm, "").trim();
        
        
        // Parse the cleaned string as JSON
        let parsedData;
        try {
            parsedData = JSON.parse(cleanedData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Failed to parse JSON response');
        }

            console.log('Parsed data:', parsedData); // Log the parsed data
            console.log(typeof parsedData); // Log the type of parsed data

            updateVocabulary(parsedData);


        } catch (error) {
            console.error('Error fetching vocabulary:', error);
        }
    }
    

  return (
    <div>
        <h1 style={{ color: "lightgrey", fontSize: 24, marginLeft: 60, borderColor: "white" }}>Select words to teach before reading</h1>
        <Grid container  className="presentation-grid-container" direction={"column"} margin={0}  spacing={0} padding={0} style={{width:"100vw", borderColor: "white"}} >
            <Grid item sm={8} style={{ backgroundColor: "white", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <div style={{ width: "90%", height: "80%", borderWidth: 0, borderColor: "white", backgroundColor:"white", padding:20 }}>
                    <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                        { vocabulary ? vocabulary.map((word, index) => (
                        <Grid container direction={"row"} key={index} style={{ marginBottom: 20, borderColor:"lightgray", borderWidth: 1, height:80}}>
                            <Grid item xs={0.5} sm={1} style={{  height:"100%", display:'flex', alignItems:"center", justifyContent:"center" }} >
                                <input type="checkbox" style={{ marginLeft: 20, width: 30, height: 30}}/>
                            </Grid>
                            <Grid item xs={4} sm={4} style={{ height:"100%", fontSize:24, display:'flex', alignItems:"center", marginLeft:10 }}>
                                <h1 style={{ color: "gray"}}>{word.word}</h1>
                            </Grid>
                        </Grid>
                        )) : null }
                    </Grid>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    <button style={{ width: 200, height: 50, backgroundColor: "lightblue", color: "white", fontSize: 24, borderRadius: 10 }} onClick={getVocabulary} >Create Slides</button>
                </div>
            </Grid>
            <Grid item sm={4}>
                <div style={{ width: "100%", height: "80vh", borderWidth: 1, borderColor: "transparent", display: "flex", justifyContent:"center" }}>
                
                    <div>
                    <div style={{width:540, height: 340, borderColor: "black", borderWidth:1,  marginTop:40 }}></div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h1 style={{ color: "black", fontSize:36, marginTop: 20 }}>{"<<     >>"}</h1>
                           
                        </div>
                       
                    </div>
                    
                    
                </div>
               
            </Grid>
        </Grid>
    </div>
  )
}

export default PreReadingVocabSlides