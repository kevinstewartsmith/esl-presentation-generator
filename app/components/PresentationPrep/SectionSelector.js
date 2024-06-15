import React, { useState } from 'react'
import { Grid } from '@mui/material'

const SectionSelector = () => {
    
    const sectionList = ["Pre Reading Vocabulary", "Pre Reading Game", "Reading for Gist", "Reading for Detail"]
  return (
    <div style={{ display: "flex", justifyContent:"center", alignContent:"center", width:"50%"}}>
        <Grid container className="presentation-grid-container" direction={"column"}  spacing={2} padding={4} style={{ display: "flex",  alignContent:"center", marginTop:0, borderColor:"white" }}>
            { sectionList.map((section, index) => (
                <Grid item sm={2}  key={index} style={{ 
                    borderColor: 'lightgray', 
                    borderWidth: 1, 
                    marginBottom: 40, 
                    height: 100,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    padding: 0,
                    backgroundColor: "white",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.40)",
                     }}>
                   
                    <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                        <Grid item xs={0.5} sm={1} style={{  height:"100%", display:'flex', alignItems:"center", justifyContent:"center" }} >
                            <input type="checkbox" style={{ width: 30, height: 30}}/>
                        </Grid>
                        <Grid item xs={4} sm={6} style={{ height:"100%", fontSize:24, display:'flex', alignItems:"center", marginLeft:10 }}>
                            <h1 style={{ color: "gray"}}>{section}</h1>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>



    </div>
  )
}

export default SectionSelector