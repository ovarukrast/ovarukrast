import React, { useState, useEffect, useCallback } from 'react';
import { generateSerVsEstarQuestions } from '../services/geminiService';
import { sendResultsEmail } from '../services/emailService';
import { SerEstarQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon, XIcon, ArrowLeftIcon } from './icons';

interface User {
    name: string;
    teacherEmail: string;
}

interface SerVsEstarProps {
    onBack: () => void;
    user: User;
}

const SerVsEstar: React.FC<SerVsEstarProps> = ({ onBack, user }) => {
    const [questions, setQuestions] = useState<SerEstarQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<'ser' | 'estar' | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);

    const fetchQuestions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await generateSerVsEstarQuestions();
            if(data.length === 0) throw new Error("No questions were generated.");
            setQuestions(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSelectOption = (option: 'ser' | 'estar') => {
        if (feedback) return;
        setSelectedOption(option);
        if (option === questions[currentQuestionIndex].correct_option) {
            setFeedback('correct');
            setScore(prev => prev + 1);
        } else {
            setFeedback('incorrect');
        }
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        setSelectedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };
    
    const restart = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setFeedback(null);
        setScore(0);
        setIsLoading(true);
        setError(null);
        setIsFinished(false);
        setEmailStatus(null);
        setIsSending(false);
        fetchQuestions();
    }
    
    const handleSendResults = async () => {
        setIsSending(true);
        setEmailStatus(null);
        const result = await sendResultsEmail({
            studentName: user.name,
            teacherEmail: user.teacherEmail,
            activityName: "Ser vs. Estar",
            score: score,
            totalQuestions: questions.length,
        });
        setEmailStatus(result);
        setIsSending(false);
    };

    if (isLoading) return <div className="w-full max-w-2xl mx-auto"><LoadingSpinner /></div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    if (isFinished) {
        return (
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800">¡Actividad Completada, {user.name}!</h2>
                <p className="mt-4 text-xl text-slate-600">
                    Tu puntuación: <span className="font-bold text-blue-600">{score}</span> de <span className="font-bold">{questions.length}</span>
                </p>
                <div className="mt-8 flex flex-col items-center space-y-4">
                    <div className="flex justify-center space-x-4">
                        <button onClick={onBack} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Menú Principal</button>
                        <button onClick={restart} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Repetir</button>
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
        );
    }
    
    if (questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const sentenceParts = currentQuestion.sentence.split('__');

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
                <ArrowLeftIcon className="w-6 h-6"/>
            </button>
            <div className="text-center mb-6">
                <p className="text-slate-500">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                 <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            
            <p className="text-2xl text-center text-slate-700 leading-relaxed mb-8">
                {sentenceParts[0]}
                <span className="inline-block w-32 mx-1 border-b-2 border-dashed border-slate-400 align-middle">
                    {feedback && <span className={`font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>{currentQuestion.correct_conjugation}</span>}
                </span>
                {sentenceParts[1]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleSelectOption(option)}
                        disabled={feedback !== null}
                        className={`p-4 text-xl font-bold rounded-lg border-2 transition-all duration-200
                            ${feedback === null ? 'hover:bg-blue-50 hover:border-blue-500' : ''}
                            ${selectedOption === option ? 
                                (feedback === 'correct' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800') :
                                'bg-white border-slate-300'
                            }
                            ${feedback !== null && option !== currentQuestion.correct_option ? 'opacity-50' : ''}
                        `}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {feedback && (
                <div className={`mt-6 p-4 rounded-lg flex flex-col items-center justify-center text-center text-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     <div className="flex items-center">
                        {feedback === 'correct' ? <CheckIcon className="w-6 h-6 mr-2"/> : <XIcon className="w-6 h-6 mr-2"/>}
                        {feedback === 'correct' ? '¡Correcto!' : `Incorrecto. Es "${currentQuestion.correct_option}".`}
                    </div>
                    <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
                </div>
            )}
            
            {feedback && (
                <div className="mt-6 flex justify-center">
                    <button onClick={handleNextQuestion} className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-all duration-200">
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default SerVsEstar;
