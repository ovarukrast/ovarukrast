import React, { useState, useEffect } from 'react';
import { SerVsEstarExercise, UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface SerVsEstarProps {
    exercise: SerVsEstarExercise;
    onComplete: (answers: UserAnswer[]) => void;
}

const SerVsEstar: React.FC<SerVsEstarProps> = ({ exercise, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const currentQuestion = exercise.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);
        setFeedback('idle');
    }, [exercise]);

    const handleAnswerSelect = (option: string) => {
        if (feedback !== 'idle') return;
        setSelectedAnswer(option);
    };

    const handleCheck = () => {
        if (feedback !== 'idle' || selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const feedbackStatus = isCorrect ? 'correct' : 'incorrect';
        setFeedback(feedbackStatus);

        const finalAnswers = [
            ...userAnswers,
            {
                questionIndex: currentQuestionIndex,
                answer: selectedAnswer,
                isCorrect: isCorrect,
            }
        ];
        setUserAnswers(finalAnswers);

        if (isLastQuestion && feedbackStatus === 'correct') {
            setTimeout(() => onComplete(finalAnswers), 1500);
        }
         if (isLastQuestion && feedbackStatus === 'incorrect') {
            setTimeout(() => onComplete(finalAnswers), 2500);
        }
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setFeedback('idle');
        }
    };

    const renderSentenceWithBlank = (sentence: string) => {
        return sentence.replace('___', '[___]');
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-center text-slate-500 mb-8">Elige la opción correcta para completar la frase.</p>
            
            <div className="my-8">
                <div className="p-4 min-h-[250px] flex flex-col justify-center">
                    <p className="text-center text-2xl text-slate-700 mb-8">
                        {renderSentenceWithBlank(currentQuestion.sentence)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedAnswer === option;
                            let buttonClass = "w-full p-4 rounded-lg border-2 text-lg font-semibold transition-all duration-200 disabled:opacity-70 ";

                            if (feedback === 'idle') {
                                buttonClass += isSelected 
                                    ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300' 
                                    : 'bg-white hover:bg-slate-50 border-slate-300';
                            } else {
                                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                if (isCorrectAnswer) {
                                    buttonClass += 'bg-green-100 border-green-500 text-green-800';
                                } else if (isSelected && !isCorrectAnswer) {
                                    buttonClass += 'bg-red-100 border-red-500 text-red-800';
                                } else {
                                     buttonClass += 'bg-slate-100 border-slate-300 text-slate-500';
                                }
                            }
                            
                            return (
                                <button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={feedback !== 'idle'}>
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {feedback === 'incorrect' && (
                         <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400">
                            <h4 className="font-bold text-green-800">Explicación:</h4>
                            <p className="text-green-700">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center">
                {feedback === 'idle' ? (
                    <button onClick={handleCheck} disabled={selectedAnswer === null} className="w-full sm:w-auto px-10 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                        Comprobar
                    </button>
                ) : (
                    <button onClick={isLastQuestion ? () => onComplete(userAnswers) : handleNext} className="w-full sm:w-auto px-10 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                        {isLastQuestion ? 'Finalizar Ejercicio' : 'Siguiente'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SerVsEstar;