import React, {useState} from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid } from '@mui/material';

const PreviewVocabSlides = ({vocabulary, selectedVocabNum}) => {

    const [selectedSlide, setSelectedSlide] = useState(0);

    const backButtonClicked = () => {
        selectedSlide > 0 ? setSelectedSlide(selectedSlide - 1) : null;
    }

    const forwardButtonClicked = () => {

        selectedSlide < selectedVocabNum ? setSelectedSlide(selectedSlide + 1) : null;
    }
  return (
    <div style={{ height: "36vh", width: "60vh", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", borderColor: "black", borderWidth: 1, borderStyle: "solid", marginTop: 40, position: "relative" }}>
            { vocabulary && vocabulary[selectedSlide].selected && vocabulary[selectedSlide].img_url && (
                <img src={vocabulary[selectedSlide].img_url} style={{ height:"70%", width: "auto", position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -30%)" }} alt={vocabulary[selectedSlide].word} />
            )}
            { vocabulary && vocabulary[selectedSlide].selected && (
                <h1 style={{ color: "black", position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "2rem" }}>{vocabulary[selectedSlide].word}</h1>
            )}
        </div>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 20 }}>
                <Grid item>
                    <button onClick={backButtonClicked}><ArrowBackIosNewIcon style={{ fontSize: 36, color: "black" }} /></button>
                </Grid>
                <Grid item>
                    <button onClick={forwardButtonClicked}><ArrowForwardIosIcon style={{ fontSize: 36, color: "black" }} /></button>
                </Grid>
        </Grid>
        <h1 style={{color: "black"}}>{selectedVocabNum}</h1>
  </div>
  )
}

export default PreviewVocabSlides