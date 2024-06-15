import React from 'react'
import { Grid } from '@mui/material'
import { lightBlue } from '@mui/material/colors'

const PreReadingVocabSlides = () => {
    const words = ['Carpet', 'Dolphin', 'Rubbish', 'Sequence']

  return (
    <div>
        <h1 style={{ color: "lightgrey", fontSize: 24, marginLeft: 60, borderColor: "white" }}>Select words to teach before reading</h1>
        <Grid container  className="presentation-grid-container" direction={"column"} margin={0}  spacing={0} padding={0} style={{width:"100vw", borderColor: "white"}} >
            <Grid item sm={8} style={{ backgroundColor: "white", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <div style={{ width: "90%", height: "80%", borderWidth: 0, borderColor: "white", backgroundColor:"white", padding:20 }}>
                    <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10 }} >
                        { words.map((word, index) => (
                        <Grid container direction={"row"} key={index} style={{ marginBottom: 20, borderColor:"lightgray", borderWidth: 1, height:80}}>
                            <Grid item xs={0.5} sm={1} style={{  height:"100%", display:'flex', alignItems:"center", justifyContent:"center" }} >
                                <input type="checkbox" style={{ marginLeft: 20, width: 30, height: 30}}/>
                            </Grid>
                            <Grid item xs={4} sm={4} style={{ height:"100%", fontSize:24, display:'flex', alignItems:"center", marginLeft:10 }}>
                                <h1 style={{ color: "gray"}}>{word}</h1>
                            </Grid>
                        </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
            <Grid item sm={4}>
                <div style={{ width: "100%", height: "80vh", borderWidth: 1, borderColor: "transparent", display: "flex", justifyContent:"center" }}>
                
                    <div>
                    <div style={{width:540, height: 340, borderColor: "black", borderWidth:1,  marginTop:40 }}></div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h1 style={{ color: "black", fontSize:36, marginTop: 20 }}>{"<<     >>"}</h1>
                        </div>
                    </div>
                    
                    
                </div>
               
            </Grid>
        </Grid>
    </div>
  )
}

export default PreReadingVocabSlides