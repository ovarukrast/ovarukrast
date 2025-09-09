import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { VocabularyMatchExercise, UserAnswer } from '../types';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

interface VocabularyMatchProps {
    exercise: VocabularyMatchExercise;
    onComplete: (answers: UserAnswer[]) => void;
}

const VocabularyMatch: React.FC<VocabularyMatchProps> = ({ exercise, onComplete }) => {
    const { items } = exercise;
    const words = useMemo(() => items.map(item => item.word), [items]);
    const definitions = useMemo(() => shuffleArray(items.map(item => item.definition)), [items]);
    const originalDefinitionIndices = useMemo(() => definitions.map(def => items.findIndex(item => item.definition === def)), [definitions, items]);

    const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
    const [selectedDefIndex, setSelectedDefIndex] = useState<number | null>(null);
    const [correctPairs, setCorrectPairs] = useState<Record<number, number>>({}); // { wordIndex: defIndex }
    const [incorrectPair, setIncorrectPair] = useState<{ word: number; def: number } | null>(null);

    const onCompleteCallback = useCallback(onComplete, []);

    useEffect(() => {
        const totalCorrect = Object.keys(correctPairs).length;
        if (totalCorrect > 0 && totalCorrect === items.length) {
            const results: UserAnswer[] = items.map((item, index) => ({
                questionIndex: index,
                answer: definitions[correctPairs[index]],
                isCorrect: true,
            }));
             // Delay to allow final animation
            setTimeout(() => onCompleteCallback(results), 500);
        }
    }, [correctPairs, items, definitions, onCompleteCallback]);


    const handleSelection = (wordIndex: number | null, defIndex: number | null) => {
        if (wordIndex === null || defIndex === null) return;
        
        const isMatchCorrect = originalDefinitionIndices[defIndex] === wordIndex;

        if (isMatchCorrect) {
            setCorrectPairs(prev => ({ ...prev, [wordIndex]: defIndex }));
        } else {
            setIncorrectPair({ word: wordIndex, def: defIndex });
            setTimeout(() => setIncorrectPair(null), 500);
        }

        setSelectedWordIndex(null);
        setSelectedDefIndex(null);
    };

    const handleWordClick = (index: number) => {
        if (Object.keys(correctPairs).map(Number).includes(index)) return;
        setSelectedWordIndex(index);
        handleSelection(index, selectedDefIndex);
    };

    const handleDefClick = (index: number) => {
        if (Object.values(correctPairs).includes(index)) return;
        setSelectedDefIndex(index);
        handleSelection(selectedWordIndex, index);
    };

    const getWordState = (index: number) => {
        if (Object.keys(correctPairs).map(Number).includes(index)) return 'correct';
        if (incorrectPair?.word === index) return 'incorrect';
        if (selectedWordIndex === index) return 'selected';
        return 'idle';
    };
    
    const getDefState = (index: number) => {
        if (Object.values(correctPairs).includes(index)) return 'correct';
        if (incorrectPair?.def === index) return 'incorrect';
        if (selectedDefIndex === index) return 'selected';
        return 'idle';
    };

    const getButtonClass = (state: 'idle' | 'selected' | 'correct' | 'incorrect') => {
        switch (state) {
            case 'correct':
                return 'bg-green-100 text-green-800 border-green-300 cursor-default';
            case 'incorrect':
                return 'bg-red-100 border-red-400 animate-pulse';
            case 'selected':
                return 'bg-indigo-100 border-indigo-400 ring-2 ring-indigo-300';
            case 'idle':
            default:
                return 'bg-white hover:bg-slate-50 border-slate-300';
        }
    };


    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-center text-slate-500 mb-8">{exercise.instructions}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Words Column */}
                <div className="space-y-3">
                    {words.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleWordClick(index)}
                            disabled={getWordState(index) === 'correct'}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${getButtonClass(getWordState(index))}`}
                        >
                            {word}
                        </button>
                    ))}
                </div>
                {/* Definitions Column */}
                <div className="space-y-3">
                    {definitions.map((def, index) => (
                         <button
                            key={index}
                            onClick={() => handleDefClick(index)}
                            disabled={getDefState(index) === 'correct'}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${getButtonClass(getDefState(index))}`}
                        >
                            {def}
                        </button>
                    ))}
                </div>
            </div>
             <div className="mt-8 text-center h-8">
                {Object.keys(correctPairs).length === items.length && (
                    <p className="text-lg font-semibold text-green-600">¡Todo correcto! Completando...</p>
                )}
            </div>
        </div>
    );
};

export default VocabularyMatch;