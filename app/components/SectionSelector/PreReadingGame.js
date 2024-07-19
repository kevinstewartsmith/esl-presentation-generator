import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'




const PreReadingGame = ({includedId}) => {
    const [preReadingGameChecked, setPreReadingGameChecked] = useState(true)

  return (
        <Grid item sm={12} lg={12}  
            className='reading-lesson-section' 
            marginBottom={4}
        >                  
            <Grid container direction={"row"} >
                <Grid  item xs={12} sm={12}  >
                    <CheckBoxAndLabel size={"medium"} label={"Pre Reading Game"} includedId={includedId}/> 
                </Grid>
            </Grid>             
        </Grid>      
  )
}

export default PreReadingGame