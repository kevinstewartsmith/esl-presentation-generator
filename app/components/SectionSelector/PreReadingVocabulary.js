import React, { useState } from 'react'
import { Grid } from '@mui/material'

import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'

const PreReadingVocabulary = () => {

    const [preReadingVocabularyChecked, setPreReadingVocabularyChecked] = useState(true)
    
    return (
        
            <Grid item sm={12} lg={12}  
                style={{ 
                    borderColor: 'lightgray', 
                    borderWidth: 1, 
                    marginBottom: 40, 
                    width: "100%",
                    display: "flex",
                    //justifyContent: "center",
                    alignContent: "center",
                    // height: "100%",
                    padding: 0,
                    backgroundColor: "white",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.40)",
                    paddingTop:40,
                    paddingBottom:40,
                    paddingLeft: 20, 
                }}>
                 <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                    <Grid item xs={12} sm={12} >          
                        <CheckBoxAndLabel size={"medium"} label={"Pre Reading Vocabulary"} /> 
                    </Grid>
                </Grid>
            </Grid>
                
      )
  
}

export default PreReadingVocabulary
