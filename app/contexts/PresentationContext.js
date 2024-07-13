"use client"
// audioContext.js
import { createContext, useState, useEffect } from 'react';

const PresentationContext = createContext();

const PresentationContextProvider = ({ children }) => {

    const [showPresentation, setShowPresentation] = useState(false);
    
    // Presentation Details
    const [textTranscript, setTextTranscript] = useState('');
    const [questions, setQuestions] = useState();
    const [answers, setAnswers] = useState();
    const [vocabulary, setVocabulary] = useState();
    const [gistReadingQuestions, setGistReadingQuestions] = useState("");
    const [gistReadingAnswers, setGistReadingAnswers] = useState("");
    const [gistReadingPage, setGistReadingPage] = useState("");
    const [textbookExercises, setTextbookExercises] = useState();
    const [discussionObjects, setDiscussionObjects] = useState([]);

    // Discussion forms state
    const [discussionForms, setDiscussionForms] = useState({});
    console.log(typeof discussionForms);
    console.log(discussionForms);
    
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

    function updateGistReadingQuestions(newGistReadingQuestions) {
        setGistReadingQuestions(newGistReadingQuestions);
        console.log(gistReadingQuestions);
    }

    function updateGistReadingAnswers(newGistReadingAnswers) {
        setGistReadingAnswers(newGistReadingAnswers);
        console.log(gistReadingAnswers);
    }

    function updateGistReadingPage(newGistReadingPage) {
        setGistReadingPage(newGistReadingPage);
        console.log(gistReadingPage)
    }

    function updateTextbookExercises(newTextbookExercises) {
        setTextbookExercises(newTextbookExercises);
    }


    //Discussion form functions
    function updateDiscussionObjects(newDiscussionObjects) {
        setDiscussionObjects(newDiscussionObjects);
    }

    
    // function addDiscussionLine(id) {
    //     setDiscussionForms(prev => {
    //         const form = prev[id] || { numberOfDiscussionLines: 0, discussionTexts: [] };
    //         return {
    //             ...prev,
    //             [id]: {
    //                 ...form,
    //                 numberOfDiscussionLines: form.numberOfDiscussionLines + 1,
    //                 discussionTexts: [...form.discussionTexts, '']
    //             }
    //         };
    //     });
    //     console.log(discussionForms);
    // }

    const addDiscussionLine = (id) => {
        setDiscussionForms(prev => {
            const form = prev[id] || { numberOfDiscussionLines: 0, discussionTexts: [] };
            return {
                ...prev,
                [id]: {
                    ...form,
                    numberOfDiscussionLines: form.numberOfDiscussionLines + 1,
                    discussionTexts: [...form.discussionTexts, '']
                }
            };
        });
    };

    function updateDiscussionText(id, index, text) {
        console.log("updateDiscussionText");
        setDiscussionForms(prev => {
            const form = prev[id] || { discussionTexts: [] };
            const newTexts = [...form.discussionTexts];
            newTexts[index] = text;
            return {
                ...prev,
                [id]: {
                    ...form,
                    discussionTexts: newTexts
                }
            };
        });
    }
    



    // const updateDiscussionText = (id, index, text) => {
    //     setDiscussionForms(prev => {
    //         const form = prev[id] || { discussionTexts: [] };
    //         const newTexts = [...form.discussionTexts];
    //         newTexts[index] = text;
    //         return {
    //             ...prev,
    //             [id]: {
    //                 ...form,
    //                 discussionTexts: newTexts
    //             }
    //         };
    //     });
    // };
    
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
            loadVocabulary,
            gistReadingQuestions,
            gistReadingAnswers,
            updateGistReadingQuestions,
            updateGistReadingAnswers,
            gistReadingPage,
            updateGistReadingPage,
            textbookExercises,
            updateTextbookExercises,
            discussionObjects,
            updateDiscussionObjects,
            discussionForms,
            addDiscussionLine,
            updateDiscussionText
        }}>
            {children}
        </PresentationContext.Provider>
      );
}

export { PresentationContext, PresentationContextProvider };