import React, { useState } from 'react'
import { Grid } from '@mui/material'

import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'

const PreReadingVocabulary = ({includedId}) => {

    const [preReadingVocabularyChecked, setPreReadingVocabularyChecked] = useState(true)
    
    return (
        <Grid item sm={12} lg={12} marginBottom={4} className='reading-lesson-section' >
            <Grid container direction={"row"}>
                <Grid item xs={12} sm={12} >          
                    <CheckBoxAndLabel size={"medium"} label={"Pre Reading Vocabulary"} includedId={includedId}/> 
                </Grid>
            </Grid>
        </Grid>         
    )
}

export default PreReadingVocabulary

