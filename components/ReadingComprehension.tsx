import React, { useState, useEffect } from 'react';
import { ReadingComprehensionExercise, UserAnswer } from '../types';

interface ReadingComprehensionProps {
    exercise: ReadingComprehensionExercise;
    onComplete: (answers: UserAnswer[]) => void;
}

const ReadingComprehension: React.FC<ReadingComprehensionProps> = ({ exercise, onComplete }) => {
    const [view, setView] = useState<'reading' | 'questions'>('reading');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const currentQuestion = exercise.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;

     useEffect(() => {
        setView('reading');
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
         
        if (isLastQuestion) {
             setTimeout(() => onComplete(finalAnswers), 1500);
        }
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setFeedback('idle');
        }
    };

    if (view === 'reading') {
        return (
             <div className="w-full max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{exercise.title}</h2>
                <div className="prose max-w-none bg-slate-50 p-6 rounded-lg my-6 text-slate-700">
                    <p className="whitespace-pre-wrap">{exercise.text}</p>
                </div>
                <div className="text-center">
                    <button onClick={() => setView('questions')} className="w-full sm:w-auto px-10 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Empezar Preguntas
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-center text-slate-500 mb-8">Pregunta {currentQuestionIndex + 1} de {exercise.questions.length}</p>

            <div className="my-8">
                <div className="p-4 min-h-[250px] flex flex-col justify-center">
                    <p className="text-xl font-semibold text-slate-800 mb-6 text-center">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => {
                             const isSelected = selectedAnswer === option;
                             let optionClass = "w-full p-4 text-left rounded-lg border-2 text-md transition-all duration-200 flex items-center space-x-3 ";

                             if (feedback === 'idle') {
                                optionClass += isSelected 
                                    ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300' 
                                    : 'bg-white hover:bg-slate-50 border-slate-300 cursor-pointer';
                             } else {
                                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                optionClass += 'cursor-default ';
                                if(isCorrectAnswer) {
                                    optionClass += 'bg-green-50 border-green-400 text-green-800';
                                } else if (isSelected && !isCorrectAnswer) {
                                    optionClass += 'bg-red-50 border-red-400 text-red-800';
                                } else {
                                    optionClass += 'bg-slate-50 border-slate-200 text-slate-500';
                                }
                             }

                            return (
                                <button key={option} onClick={() => handleAnswerSelect(option)} className={optionClass} disabled={feedback !== 'idle'}>
                                    <span>{option}</span>
                                </button>
                            );
                        })}
                    </div>
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

export default ReadingComprehension;