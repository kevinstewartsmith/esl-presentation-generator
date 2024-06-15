"use client"
// audioContext.js
import { createContext, useState, useEffect } from 'react';

const PresentationContext = createContext();

const PresentationContextProvider = ({ children }) => {

    const [showPresentation, setShowPresentation] = useState(false);

    const [textTranscript, setTextTranscript] = useState('');
    const [questions, setQuestions] = useState();
    const [answers, setAnswers] = useState();
    const [vocabulary, setVocabulary] = useState();
  
    
    function updateTextTranscript(newTextTranscript) {
        setTextTranscript(newTextTranscript);
    }

    function updateQuestions(newQuestions) {
        setQuestions(newQuestions);
    }

    function updateAnswers(newAnswers) {
        setAnswers(newAnswers);
    }
    
    function updateVocabulary(newVocabulary) {
        setVocabulary(newVocabulary);
    }
    
    
    
    return (
        <PresentationContext.Provider value={{ 
            textTranscript, 
            setTextTranscript, 
            questions, 
            vocabulary,
            setQuestions, 
            answers, 
            setAnswers, 
            updateTextTranscript, 
            updateQuestions, 
            updateAnswers,
            updateVocabulary,
        }}>
            {children}
        </PresentationContext.Provider>
      );
}

export { PresentationContext, PresentationContextProvider };