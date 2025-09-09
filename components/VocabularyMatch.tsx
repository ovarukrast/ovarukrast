
import React, { useState, useEffect } from 'react';
import { VocabularyMatchExercise, UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface VocabularyMatchProps {
    exercise: VocabularyMatchExercise;
    onFinish: (answers: UserAnswer[]) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const VocabularyMatch: React.FC<VocabularyMatchProps> = ({ exercise, onFinish }) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({}); // { word: definition }
    const [submitted, setSubmitted] = useState(false);
    
    // Shuffle definitions once on component mount
    const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);
    useEffect(() => {
        setShuffledDefinitions(shuffleArray(exercise.items.map(item => item.definition)));
    }, [exercise.items]);


    useEffect(() => {
        if (selectedWord && selectedDefinition) {
            setMatches(prev => ({ ...prev, [selectedWord]: selectedDefinition }));
            setSelectedWord(null);
            setSelectedDefinition(null);
        }
    }, [selectedWord, selectedDefinition]);

    const handleWordSelect = (word: string) => {
        if (matches[word]) { // Unmatch
            const newMatches = {...matches};
            delete newMatches[word];
            setMatches(newMatches);
        } else {
             setSelectedWord(word);
        }
    };
    
    const handleDefinitionSelect = (definition: string) => {
        const isAlreadyMatched = Object.values(matches).includes(definition);
         if (isAlreadyMatched) { // Unmatch
            const wordToUnmatch = Object.keys(matches).find(key => matches[key] === definition);
            if(wordToUnmatch) {
                const newMatches = {...matches};
                delete newMatches[wordToUnmatch];
                setMatches(newMatches);
            }
        } else {
            setSelectedDefinition(definition);
        }
    };
    
    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleFinish = () => {
         const results: UserAnswer[] = exercise.items.map((item, index) => {
            const userAnswer = matches[item.word] || "";
            return {
                questionIndex: index,
                answer: userAnswer,
                isCorrect: userAnswer === item.definition,
            };
        });
        onFinish(results);
    };

    const isAllMatched = Object.keys(matches).length === exercise.items.length;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-slate-600 mb-8">{exercise.instructions}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Words Column */}
                <div className="space-y-3">
                    {exercise.items.map(item => {
                        const isSelected = selectedWord === item.word;
                        const isMatched = !!matches[item.word];
                        let isCorrect: boolean | null = null;
                        if(submitted && isMatched) {
                            const originalItem = exercise.items.find(i => i.word === item.word);
                            isCorrect = originalItem?.definition === matches[item.word];
                        }
                        
                        return (
                            <button
                                key={item.word}
                                onClick={() => !submitted && handleWordSelect(item.word)}
                                disabled={submitted}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                    isSelected ? "border-blue-500 bg-blue-100 ring-2 ring-blue-300" :
                                    isMatched ? (submitted ? (isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400") : "bg-slate-200 border-slate-300") :
                                    "bg-white border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <span className={isMatched && submitted ? (isCorrect ? "text-green-800" : "text-red-800") : "text-slate-800"}>{item.word}</span>
                                {isMatched && submitted && (
                                    isCorrect ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <XCircleIcon className="h-5 w-5 text-red-500" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Definitions Column */}
                <div className="space-y-3">
                    {shuffledDefinitions.map(definition => {
                        const isSelected = selectedDefinition === definition;
                        const matchedWord = Object.keys(matches).find(key => matches[key] === definition);
                        const isMatched = !!matchedWord;

                        let isCorrect: boolean | null = null;
                        if(submitted && isMatched && matchedWord) {
                            const originalItem = exercise.items.find(i => i.word === matchedWord);
                            isCorrect = originalItem?.definition === definition;
                        }

                        return (
                            <button
                                key={definition}
                                onClick={() => !submitted && handleDefinitionSelect(definition)}
                                disabled={submitted}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                    isSelected ? "border-blue-500 bg-blue-100 ring-2 ring-blue-300" :
                                    isMatched ? (submitted ? (isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400") : "bg-slate-200 border-slate-300") :
                                    "bg-white border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                 <span className={isMatched && submitted ? (isCorrect ? "text-green-800" : "text-red-800") : "text-slate-600"}>{definition}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

             <div className="mt-10 text-center">
                 {submitted ? (
                    <button
                        onClick={handleFinish}
                        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-300"
                    >
                        Ver Resultados
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isAllMatched}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300"
                    >
                        Revisar Respuestas
                    </button>
                )}
            </div>
        </div>
    );
};

export default VocabularyMatch;
