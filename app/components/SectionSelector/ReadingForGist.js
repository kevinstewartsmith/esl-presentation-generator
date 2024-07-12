import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'
import FreeSoloDropDown from '../PresentationPrep/AddTextButtons/FreeSoloDropDown'
import InputWithIcon from '../PresentationPrep/AddTextButtons/InputWithIcon'
import TimeLimitSlider from '../PresentationPrep/AddTextButtons/TimeLimitSlider'
import DiscussionForm from '../PresentationPrep/DiscussionForm'


export const ReadingForGist = ({index}) => {
    const [gistReadingChecked, setGistReadingChecked] = useState(true)

    const handleCheckBoxChange = () => {
        setGistReadingChecked(!gistReadingChecked);
    };

    return (
    <>
        <Grid item sm={12} lg={12}  key={index} marginBottom={4} className='reading-lesson-section'>
            <Grid container direction={"row"}>
                <Grid item xs={12} sm={12} >
                    <CheckBoxAndLabel size={"medium"} label={"Reading For Gist"}  checked={gistReadingChecked} onChange={handleCheckBoxChange} /> 
                </Grid> 
                
                { gistReadingChecked ?
                <Grid item xs={12} sm={12} 
                    className='section-details-container'
                    //style={{ display:'flex', alignItems:"center", justifyContent:"center", paddingTop: 40 }}
                >
                    <Grid container direction={"row"} style={{ backgroundColor: "white", paddingLeft:60, paddingBottom:20 }} >
                        <Grid item xs={12} sm={6} paddingBottom={4}  >
                            <Grid container direction={"row"}  spacing={2} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} > 
                                <Grid item xs={12} sm={12}  >
                                    <FreeSoloDropDown label={"Book Name"} input={"book"}/>
                                </Grid>
                                <Grid item xs={12} sm={12}  >
                                    <FreeSoloDropDown label={"Text Title"} input={"input"} />
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
