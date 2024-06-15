"use client";
import React from 'react'
import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import '../globals.css';
import Checkbox from '@mui/material/Checkbox';
import PresentationItems from '@app/components/PresentationPrep/PresentationItems';


const page = () => {
    const [checked, setChecked] = useState(true);
    const handleChange = (event) => {
        setChecked(event.target.checked);
    }

    const slides = [
        "Advantages/Disadvantages",
        "Sharing",
        "Brainstorm",
        "Sharing",
        "Reading for Gist",
        "Partner Check",
        "Book Answer",
        "Reading for Detail",
        "Partner Check",
        "Book Answer",
    ]
//container style={{ width: "80%", height: "80vh", borderWidth: 1, borderColor: "white", }}
//<div className="presentation" style={{ width:"100vw", height:"100vh", display: "flex", justifyContent: "center", alignItems: "center"  }}>
return (
    
    <div className="presentation" >
        <Grid container className="presentation-grid-container" direction={"row"}  spacing={12} padding={4}>
            { slides.map((slide, index) => (
                
                <PresentationItems slide={slide} index={index} />
            ))}
        </Grid>
    </div>
)
}

export default page