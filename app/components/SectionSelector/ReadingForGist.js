import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'
import FreeSoloDropDown from '../PresentationPrep/AddTextButtons/FreeSoloDropDown'
import InputWithIcon from '../PresentationPrep/AddTextButtons/InputWithIcon'
import DiscreteSlider from '../PresentationPrep/AddTextButtons/DiscreteSlider'
import TimeLimitSlider from '../PresentationPrep/AddTextButtons/TimeLimitSlider'
import DiscussionForm from '../PresentationPrep/DiscussionForm'


export const ReadingForGist = ({index}) => {
    const [gistReadingChecked, setGistReadingChecked] = useState(true)

  return (
    <>
        <Grid item sm={12} lg={12}  key={index} style={{ 
            borderColor: 'lightgray', 
            borderWidth: 1, 
            marginBottom: 40, 
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            // height: "100%",
            padding: 0,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.40)",
        }}>
                            
            <Grid container direction={"row"}  spacing={0} margin={2} padding={0} style={{ backgroundColor: "white", paddingLeft:10, marginTop: 40 }} >
                <Grid item xs={12} sm={12} >
                    <CheckBoxAndLabel size={"medium"} label={"Reading For Gist"} /> 
                </Grid> 

                                
                { gistReadingChecked ?
                <Grid item xs={12} sm={12} style={{ display:'flex', alignItems:"center", justifyContent:"center", paddingTop: 40 }}>
                    <Grid container direction={"row"}  spacing={0} style={{ backgroundColor: "white", paddingLeft:60, paddingBottom:20 }} >
                        <Grid item xs={12} sm={6} paddingBottom={4}  >
                            <Grid container direction={"row"}  spacing={2} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} > 
                                <Grid item xs={12} sm={12}  >
                                    <FreeSoloDropDown label={"Book"} input={"book"}/>
                                </Grid>
                                <Grid item xs={12} sm={12}  >
                                    <FreeSoloDropDown label={"Title"} input={"input"} />
                                </Grid>
                            </Grid>    
                        </Grid>
                        <Grid item xs={12} sm={6} paddingBottom={4} >
                            <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                                <Grid item xs={12} sm={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <InputWithIcon label={"Page"} input={"page"} />
                                </Grid>
                            </Grid>    
                        </Grid>
                        <Grid item xs={12} sm={12} paddingBottom={4} >
                            <TimeLimitSlider label={"Reading Time Limit"} />
                        </Grid>
                        <Grid item xs={12} sm={12} paddingBottom={4} >
                            <InputWithIcon iconFirst={true} label={"Question"} input={"question"} size={"wide"} />
                        </Grid>
                        <Grid item xs={12} sm={12} paddingBottom={4} >
                            <InputWithIcon iconFirst={true} label={"Answer"} input={"answer"} />     
                        </Grid>
                        
                        <Grid item xs={12} sm={12} paddingBottom={4} >
                            
                           <DiscussionForm />
                        </Grid>
                        <Grid item xs={12} sm={12} paddingBottom={4} >
                            
                            <TimeLimitSlider label={"Discussion Time Limit"} />

                         </Grid>
                    </Grid>
                </Grid> : null }                   
            </Grid>
        </Grid>      
    </>
  )
}
