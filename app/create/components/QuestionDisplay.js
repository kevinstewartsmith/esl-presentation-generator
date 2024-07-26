import React from 'react'
import { Grid, Item } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SnippetPlayer from './SnippetPlayer';

function QuestionDisplay({snippetData}) {
  return (
    <Grid container spacing={0} >
    {snippetData ? snippetData.map((snippet, index) => {
      return (
        <Grid item xs={12} key={index} style={{ borderWidth: 3, borderColor: "white",borderRadius: 15,marginTop:25, padding:30 }}>
            <Grid container spacing={2} >
                <Grid item xs={11} key={index} >
                    <div style={{   width: "100%", height: "100%"}}>
                    <h1 style={{ fontSize:"2rem" }}><strong>{`${index + 1} - ` + snippetData[index].question}</strong></h1>
                    <h1><em>{snippetData[index].answer}</em></h1>
                    <h1 style={{ fontSize:"1.5rem" }}><em>"{snippetData[index].snippet}"</em></h1>
                    </div> 
                </Grid> 
                <Grid item xs={1}>
                    {/* <div style={{ backgroundColor: "transparent", width: "100px", height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }}>
                        <PlayCircleFilledWhiteIcon style={{ width: "100%", height: "100%" }} />
                    </div> */}
                    <SnippetPlayer index={index}/>
                </Grid>
            </Grid>          
        </Grid>
      )
    }) : null}
  </Grid>
  )
}

export default QuestionDisplay