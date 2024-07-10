import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

export default function InputWithIcon({label, input, size, iconFirst}) {
  function setInput(){
    switch (input) {
      case "question":
        return <HelpOutlineIcon  sx={{ color: '#333', mr: 1, my: 0.5 }}/>
        break;
      case "answer":
        return <FeedbackIcon sx={{ color: '#333', mr: 1, my: 0.5 }}/>
        break;
      case "page":
        return <PlagiarismIcon sx={{ color: '#333', mr: 1, my: 0.5 }}/>
        break;
      default:
        return <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
    }
  }


  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>

      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        {iconFirst ? setInput() : null}
        <TextField id="input-with-sx" label={label} variant="standard" style={{ width: "90%" }} />
        { !iconFirst ? setInput() : null }
      </Box>
    </Box>
  );
}
