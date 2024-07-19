import React from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from './AddTextButtons/CheckBoxAndLabel'
import InputWithIcon from './AddTextButtons/InputWithIcon'

const DetailReadingExercises = ({ includedId }) => {
  
    return (
    <Grid item xs={12} sm={12}  >
        <Grid container direction={"column"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:0 }} > 
            <Grid item xs={12} sm={12}  >
                <CheckBoxAndLabel label={"Exercises"} size={"small"} includedId={includedId} />
            </Grid>
            <Grid item xs={12} sm={12} style={{ marginLeft: "10%", marginRight: "60%" }} >
                <InputWithIcon label={"Textbook Exercises"} input={"exercise"} iconFirst={"true"} />
            </Grid>
        </Grid>
    </Grid>
  )
}

export default DetailReadingExercises