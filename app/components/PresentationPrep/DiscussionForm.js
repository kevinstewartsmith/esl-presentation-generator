import { Grid } from '@mui/material'
import React, { useState } from 'react'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'
import InputWithIcon from '../PresentationPrep/AddTextButtons/InputWithIcon'
import AddIcon from '@mui/icons-material/Add';

const DiscussionForm = () => {
    const [numberOfDiscussionLines, setNumberOfDiscussionLines] = useState(3)

  return (
    <div className='border border-gray-300 rounded-lg m-4 relative' >
        <Grid container direction={"row"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:0 }} >
            <Grid item xs={12} sm={12} >
                <CheckBoxAndLabel size={"small"} label={"Partner Check Discussion"} /> 
            </Grid>
                { Array.from({ length: numberOfDiscussionLines }).map((_, index) => (
                     <Grid item xs={12} sm={12} key={index} paddingLeft={index % 2 === 0 ? 0 : 5} paddingRight={index % 2 !== 0 ? 0 : 3}>
                        { index % 2 === 0 ? 
                            <InputWithIcon iconFirst={true}   /> : 
                            <InputWithIcon iconFirst={false}   />
                        }
                    </Grid>
                ))}
        </Grid>
        <button onClick={() => setNumberOfDiscussionLines(numberOfDiscussionLines + 1)}><AddIcon sx={{                     
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'gray',
          
             }} />
        </button>
    </div>
  )
}

export default DiscussionForm