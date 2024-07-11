import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'
import InputWithIcon from '../PresentationPrep/AddTextButtons/InputWithIcon'
import TimeLimitSlider from '../PresentationPrep/AddTextButtons/TimeLimitSlider'
import DiscussionForm from '../PresentationPrep/DiscussionForm'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const ReadingForDetail = () => {
    const [detailReadingChecked, setDetailReadingChecked] = useState(true)
    
    const handleCheckBoxChange = () => {
        setDetailReadingChecked(!detailReadingChecked);
    };

  return (
    <>
        <Grid item sm={12} lg={12} className='reading-lesson-section'>
                            
            <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                <Grid item xs={12} sm={12} >
                    <CheckBoxAndLabel size={"medium"} label={"Reading For Detail"} checked={detailReadingChecked} onChange={handleCheckBoxChange}/> 
                </Grid> 

                                
                { detailReadingChecked ?
                <Grid item xs={12} sm={12} style={{ display:'flex', alignItems:"center", justifyContent:"center", paddingTop: 40 }}>
                    <Grid container direction={"row"} style={{ backgroundColor: "white", paddingLeft: 60, paddingBottom: 20 }} >
                        <Grid item xs={12} sm={12}  >
                            <Grid container direction={"column"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:0 }} > 
                                <Grid item xs={12} sm={12}  >
                                    <CheckBoxAndLabel label={"Exercises"} size={"small"} />
                                </Grid>
                                <Grid item xs={12} sm={12} style={{ marginLeft: "10%", marginRight: "60%" }} >
                                    <InputWithIcon label={"Textbook Exercises"} input={"exercise"} iconFirst={"true"} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Answers"} size={"small"} />  
                        </Grid>
                        <Grid item xs={12} sm={12} style={{ color: "black" }} >
                            {/* <CheckBoxAndLabel label={"Reading Time Limit"}  /> */}
                            <TimeLimitSlider label={"Reading Time Limit"} />
                        </Grid>
                        <Grid item xs={12} sm={12} >
                            <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                                <Grid item xs={12} sm={12}  >
                                    <CheckBoxAndLabel label={"Partner Check Discussion"} size={"small"} />
                                </Grid>
                                <Grid item xs={12} sm={12}  >
                                   <DiscussionForm />
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={12} sm={12} paddingBottom={4}  >
                            <TimeLimitSlider label={"Discussion Time Limit"} />
                         </Grid>
                    </Grid>
                </Grid> : null }                   
            </Grid>
        </Grid>   
    </>
  )
}

export default ReadingForDetail