import React from 'react'
import AddTextBook from './AddTextBook'
const ReadingContent = () => {
  return (
    <div>
        
        <div style={{ paddingTop:40}}>
            <AddTextBook category={"BookText"} />
            <AddTextBook category={"QuestionText"}/>
            <AddTextBook category={"AnswerText"}/>
        </div>
    </div>
  )
}

export default ReadingContent