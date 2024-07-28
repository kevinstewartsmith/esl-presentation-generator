import React,{ useContext } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from './AddTextButtons/CheckBoxAndLabel'
import { PresentationContext } from '@app/contexts/PresentationContext'

const DetailReadingExAnswers = ({ includedId }) => {
    const { textTranscript } = useContext(PresentationContext)
  return (
    <Grid item xs={12} sm={12}  >
        <Grid container direction={"column"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:0 }} > 
            <Grid item xs={12} sm={12}  >
                <CheckBoxAndLabel label={"Answers"} size={"small"} includedId={includedId} /> 
            </Grid>
            <Grid item xs={12} sm={12}>
            { textTranscript ? <h1 style={{color:"black"}}>{textTranscript}</h1> : null}
            </Grid>
        </Grid>
    </Grid>
  )
}

export default DetailReadingExAnswers