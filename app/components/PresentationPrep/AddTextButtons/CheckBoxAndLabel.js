import React, { useContext, useEffect, useState } from 'react'
import { PresentationContext } from '@app/contexts/PresentationContext'
import { Grid } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CheckBoxAndLabel = ({ label, input, size, checked, onChange, includedId }) => {

const { included, updateIncludedSection } = useContext(PresentationContext)

    function onCheck() {
        //console.log("onChange: " + includedId);
        updateIncludedSection(includedId);
        //console.log(included);
    }


    useEffect(() => {
        console.log("INCLUDED");
        console.log(included);
    }, [included]);

    function setInputSize() {
        switch (size) {
            case "small":
                //console.log("small: " + size);
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
    <div  className='pink-background'>
        <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:10, paddingTop:0, width: "100%" }} >
            <Grid item xs={0.5} sm={1} className='flex justify-center items-center height-full' style={{ }} >
                <input 
                    type="checkbox" 
                    style={{ width: setInputSize(), height: setInputSize()}} 
                    checked={included[includedId] ? included[includedId] : false}
                    onChange={onCheck} 
                />
            </Grid>
            <Grid item xs={11.5} sm={11}  style={{ fontSize:24}}>
                <h1  style={{color: "gray"}}>{label}</h1>
            </Grid>
        </Grid> 
    </div>
  )
}

export default CheckBoxAndLabel


