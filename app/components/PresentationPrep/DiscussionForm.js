import { Grid } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import CheckBoxAndLabel from '../PresentationPrep/AddTextButtons/CheckBoxAndLabel'
import InputWithIcon from '../PresentationPrep/AddTextButtons/InputWithIcon'
import AddIcon from '@mui/icons-material/Add';
import { PresentationContext } from '@app/contexts/PresentationContext'
import { PhotoSizeSelectLargeTwoTone } from '@mui/icons-material';

const DiscussionForm = ({id}) => {
    //const [numberOfDiscussionLines, setNumberOfDiscussionLines] = useState(2)
    const { discussionForms, addDiscussionLine, updateDiscussionText  }= useContext(PresentationContext)
    console.log("DiscussionForm render_discussionForms: " + discussionForms);
    const discussionForm = discussionForms[id] || { numberOfDiscussionLines: 2, discussionTexts: Array(2).fill('') };

    useEffect(() => {
        if (!discussionForms[id]) {
            addDiscussionLine(id); // Initialize with the first line
            addDiscussionLine(id); // Initialize with the second line
        }
        console.log("discussionForms: " + discussionForms);
    }, [id, discussionForms, addDiscussionLine]);

    

  return (

    <Grid container direction={"row"}  spacing={0} padding={0}  >
        <Grid item xs={12} sm={12}  >
            <CheckBoxAndLabel label={"Partner Check Discussion"} size={"small"} />
        </Grid>
        <Grid item xs={12} sm={12} className='flex justify-center items-center'>
            <div className='border border-gray-300 rounded-lg m-4 relative p-4 w-4/5' >
                 <Grid container direction={"row"} >
                    
                    {/* {Array.from({ length: discussionForm.numberOfDiscussionLines }).map((_, index) => (
                    
                        <Grid item xs={12} sm={12} key={index} paddingLeft={index % 2 === 0 ? 0 : 5} paddingRight={index % 2 !== 0 ? 0 : 3}>
                            <InputWithIcon 
                                iconFirst={index % 2 === 0} 
                                value={discussionForm.discussionTexts[index] || ''} 
                                onChange={(e) => updateDiscussionText(id, index, e.target.value)} 
                            />
                        </Grid>
                    )) }  */}

                    { discussionForm.discussionTexts && discussionForm.discussionTexts.map((text, index) => (
                            
                            <Grid item xs={12} sm={12} key={index} paddingLeft={index % 2 === 0 ? 0 : 5} paddingRight={index % 2 !== 0 ? 0 : 3}>
                                <InputWithIcon 
                                    // iconFirst={index % 2 === 0} 
                                    // //value={text || ''} 
                                    // //onChange={(e) => updateDiscussionText(id, index, e.target.value)} 
                                    // discussionLine={text || "test"}
                                    // text={text}
                                    // index={index}
                                    // input={"discussion"}


                                    iconFirst={index % 2 === 0} 
                                    discussionLine={text || "test"}
                                    text={text}
                                    index={index}
                                    input={"discussion"}
                                    id={id}
                                />
                                
                            </Grid>
                        )) }
                </Grid>
        
                <button onClick={() => addDiscussionLine(id)}>
                    <AddIcon className='add-discussion-line-button' />
                </button>
            </div>
        </Grid>
    </Grid>
    )
}

export default DiscussionForm