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

    function loadVocabulary(data) {
        // Add the fields selected: false and img_url: null to each word object
        const words = data.map(word => {
            return {
                ...word,
                selected: false,
                img_url: ""
            }
        });
        console.log(words);
        setVocabulary(words);
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
            loadVocabulary
        }}>
            {children}
        </PresentationContext.Provider>
      );
}

export { PresentationContext, PresentationContextProvider };