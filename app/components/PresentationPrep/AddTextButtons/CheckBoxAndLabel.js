import React from 'react'
import { Grid } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CheckBoxAndLabel = ({ label, input, size }) => {

    function setInputSize() {
        switch (size) {
            case "small":
                console.log("small: " + size);
                return 20
                break;
            case "medium":
                return 30
                break;
            case "large":
                return 40
                break;
            default:
                return 30
        }
    }



  return (
    <div>
        <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10, paddingTop:0, width: "100%" }} >
            <Grid item xs={0.5} sm={1} className='flex justify-center items-center height-full' style={{ }} >
                <input type="checkbox" style={{ width: setInputSize(), height: setInputSize()}}/>
            </Grid>
            <Grid item xs={11.5} sm={11}  style={{ fontSize:24}}>
                <h1 style={{ color: "gray", }}>{label}</h1>
            </Grid>
        </Grid> 
    </div>
  )
}

export default CheckBoxAndLabel