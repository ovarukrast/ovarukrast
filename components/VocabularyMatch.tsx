import React, { useState, useEffect, useCallback } from 'react';
import { generateVocabularyPairs } from '../services/geminiService';
import { sendResultsEmail } from '../services/emailService';
import { VocabularyPair } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeftIcon } from './icons';

interface User {
    name: string;
    teacherEmail: string;
}

interface VocabularyMatchProps {
    onBack: () => void;
    user: User;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const VocabularyMatch: React.FC<VocabularyMatchProps> = ({ onBack, user }) => {
    const [pairs, setPairs] = useState<VocabularyPair[]>([]);
    const [spanishWords, setSpanishWords] = useState<string[]>([]);
    const [greekWords, setGreekWords] = useState<string[]>([]);
    const [selectedSpanish, setSelectedSpanish] = useState<string | null>(null);
    const [selectedGreek, setSelectedGreek] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [incorrectAttempts, setIncorrectAttempts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);

    const fetchVocabulary = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await generateVocabularyPairs();
            if(data.length === 0) throw new Error("No vocabulary was generated.");
            setPairs(data);
            setSpanishWords(shuffleArray(data.map(p => p.spanish_word)));
            setGreekWords(shuffleArray(data.map(p => p.greek_translation)));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVocabulary();
    }, [fetchVocabulary]);
    
    useEffect(() => {
        if (selectedSpanish && selectedGreek) {
            const correctPair = pairs.find(p => p.spanish_word === selectedSpanish);
            if (correctPair && correctPair.greek_translation === selectedGreek) {
                setMatchedPairs(prev => [...prev, selectedSpanish]);
            } else {
                setIncorrectAttempts([selectedSpanish, selectedGreek]);
                setTimeout(() => {
                    setIncorrectAttempts([]);
                }, 800);
            }
            setTimeout(() => {
                setSelectedSpanish(null);
                setSelectedGreek(null);
            }, 500);
        }
    }, [selectedSpanish, selectedGreek, pairs]);

    const isFinished = matchedPairs.length === pairs.length && pairs.length > 0;
    
    const restart = () => {
        setPairs([]);
        setSpanishWords([]);
        setGreekWords([]);
        setSelectedSpanish(null);
        setSelectedGreek(null);
        setMatchedPairs([]);
        setIncorrectAttempts([]);
        setEmailStatus(null);
        setIsSending(false);
        fetchVocabulary();
    };

    const handleSendResults = async () => {
        if (pairs.length === 0) return;
        setIsSending(true);
        setEmailStatus(null);
        const result = await sendResultsEmail({
            studentName: user.name,
            teacherEmail: user.teacherEmail,
            activityName: "Vocabulario",
            score: pairs.length,
            totalQuestions: pairs.length,
        });
        setEmailStatus(result);
        setIsSending(false);
    };

    if (isLoading) return <div className="w-full max-w-3xl mx-auto"><LoadingSpinner /></div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
                <ArrowLeftIcon className="w-6 h-6"/>
            </button>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Une las Parejas</h2>
            <p className="text-center text-slate-500 mb-6">Haz clic en una palabra en español y su traducción en griego.</p>

            {isFinished ? (
                 <div className="text-center p-8">
                    <h2 className="text-3xl font-bold text-green-600">¡Excelente, {user.name}!</h2>
                    <p className="mt-4 text-xl text-slate-600">Has encontrado todas las parejas.</p>
                     <div className="mt-8 flex flex-col items-center space-y-4">
                        <div className="flex justify-center space-x-4">
                            <button onClick={onBack} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Menú Principal</button>
                            <button onClick={restart} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Jugar de Nuevo</button>
                        </div>
                        <div className="pt-4 mt-4 border-t w-full max-w-sm mx-auto">
                            <button 
                                onClick={handleSendResults} 
                                disabled={isSending || (emailStatus?.success ?? false)}
                                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Enviando...' : (emailStatus?.success ? '¡Resultados Enviados!' : 'Enviar Resultados al Profesor')}
                            </button>
                            {emailStatus && !emailStatus.success && (
                                <p className="text-red-500 text-sm mt-2">{emailStatus.message}</p>
                            )}
                             {emailStatus?.success && (
                                <p className="text-green-600 text-sm mt-2">{emailStatus.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {/* Spanish Words Column */}
                    <div className="space-y-3">
                        {spanishWords.map(word => {
                            const isMatched = matchedPairs.includes(word);
                            const isSelected = selectedSpanish === word;
                            const isIncorrect = incorrectAttempts.includes(word);
                            return (
                                <button
                                    key={word}
                                    onClick={() => !isMatched && setSelectedSpanish(word)}
                                    disabled={isMatched}
                                    className={`w-full p-4 text-lg rounded-lg border-2 transition-all duration-200 text-center capitalize font-semibold
                                        ${isMatched ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed' : ''}
                                        ${!isMatched && isSelected ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'border-slate-300'}
                                        ${isIncorrect ? '!bg-red-100 !border-red-500' : ''}
                                        ${!isMatched ? 'hover:bg-blue-50' : ''}
                                    `}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                    {/* Greek Words Column */}
                    <div className="space-y-3">
                         {greekWords.map(word => {
                            const pair = pairs.find(p => p.greek_translation === word);
                            const isMatched = pair && matchedPairs.includes(pair.spanish_word);
                            const isSelected = selectedGreek === word;
                            const isIncorrect = incorrectAttempts.includes(word);
                            return (
                                <button
                                    key={word}
                                    onClick={() => !isMatched && setSelectedGreek(word)}
                                    disabled={isMatched}
                                    className={`w-full p-4 text-lg rounded-lg border-2 transition-all duration-200 text-center capitalize font-semibold
                                        ${isMatched ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed' : ''}
                                        ${!isMatched && isSelected ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'border-slate-300'}
                                        ${isIncorrect ? '!bg-red-100 !border-red-500' : ''}
                                        ${!isMatched ? 'hover:bg-blue-50' : ''}
                                    `}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VocabularyMatch;
