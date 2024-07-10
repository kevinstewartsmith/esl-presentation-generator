import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'


const ReadingForDetail = () => {
    const [detailReadingChecked, setDetailReadingChecked] = useState(true)


  return (
    <>
            <Grid item sm={12} lg={12}  style={{ 
            borderColor: 'lightgray', 
            borderWidth: 1, 
            marginBottom: 40, 
            // height: 100,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            padding: 0,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.40)",
        }}>
                            
            <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                <Grid item xs={12} sm={12} >
                    <CheckBoxAndLabel size={"large"} label={"Reading For Detail"} /> 
                </Grid> 

                                
                { detailReadingChecked ?
                <Grid item xs={12} sm={12} style={{ display:'flex', alignItems:"center", justifyContent:"center" }}>
                    <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                        {/* <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Book"} />  
                        </Grid>
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Title"} />  
                        </Grid>
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Page"} />
                        </Grid> */}
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Exercises"} />
                        </Grid>
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Answers"} />  
                        </Grid>
                        <Grid item xs={12} sm={12} style={{ color: "black" }} >
                            <CheckBoxAndLabel label={"Reading Time Limit"} />
                        </Grid>
                        <Grid item xs={12} sm={12} >
                            <CheckBoxAndLabel label={"Partner Check Discussion"} />
                        </Grid>
                        <Grid item xs={12} sm={12}  >
                            <CheckBoxAndLabel label={"Discussion Time Limit"} />
                         </Grid>
                    </Grid>
                </Grid> : null }                   
            </Grid>
        </Grid>   
    </>
  )
}

export default ReadingForDetail