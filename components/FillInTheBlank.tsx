import React, { useState, useEffect } from 'react';
import { FillInTheBlankExercise, UserAnswer } from '../types';

interface FillInTheBlankProps {
    exercise: FillInTheBlankExercise;
    onComplete: (answers: UserAnswer[]) => void;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ exercise, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const currentQuestion = exercise.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        setUserAnswers([]);
        setFeedback('idle');
    }, [exercise]);

    const handleCheck = () => {
        if (feedback !== 'idle' || !currentAnswer.trim()) return;

        const isCorrect = currentAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        const feedbackStatus = isCorrect ? 'correct' : 'incorrect';
        setFeedback(feedbackStatus);

        const finalAnswers = [
            ...userAnswers,
            {
                questionIndex: currentQuestionIndex,
                answer: currentAnswer,
                isCorrect: isCorrect,
            }
        ];
        setUserAnswers(finalAnswers);

        if (isLastQuestion) {
             // Delay completion to allow user to see feedback on the last question
             setTimeout(() => onComplete(finalAnswers), 1500);
        }
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
            setFeedback('idle');
        }
    };

    const renderSentence = (sentence: string) => {
        const parts = sentence.split('___');
        let inputClass = "inline-block w-48 mx-2 px-3 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none text-lg text-indigo-600 font-semibold ";
        if (feedback === 'correct') {
            inputClass += "bg-green-50 border-green-400 text-green-700 ring-2 ring-green-200";
        } else if (feedback === 'incorrect') {
            inputClass += "bg-red-50 border-red-400 text-red-700 ring-2 ring-red-200";
        } else {
            inputClass += "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300";
        }

        return (
            <p className="text-xl text-slate-700 leading-loose">
                {parts[0]}
                <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className={inputClass}
                    disabled={feedback !== 'idle'}
                    onKeyDown={(e) => e.key === 'Enter' && (feedback === 'idle' ? handleCheck() : handleNext())}
                    aria-label="Respuesta"
                />
                {parts[1]}
            </p>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-center text-slate-500 mb-8">{exercise.instructions}</p>
            <div className="my-8">
                <div className="p-4 min-h-[180px] flex flex-col justify-center">
                     <div className="flex items-center">
                       <span className="mr-4 text-2xl font-bold text-indigo-500">{currentQuestionIndex + 1}.</span>
                       {renderSentence(currentQuestion.sentence)}
                    </div>
                    {feedback === 'incorrect' && (
                        <p className="ml-12 mt-3 text-md text-green-700 transition-opacity duration-300 animate-pulse">
                            Respuesta correcta: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                        </p>
                    )}
                    {currentQuestion.hintInGreek && feedback === 'idle' && (
                        <p className="ml-12 mt-2 text-sm text-slate-500">
                            <span className="font-semibold">Πίστα:</span> {currentQuestion.hintInGreek}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-8 text-center">
                {feedback === 'idle' ? (
                    <button
                        onClick={handleCheck}
                        disabled={!currentAnswer.trim()}
                        className="w-full sm:w-auto px-10 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Comprobar
                    </button>
                ) : (
                    <button
                        onClick={isLastQuestion ? () => onComplete(userAnswers) : handleNext}
                        className="w-full sm:w-auto px-10 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        {isLastQuestion ? 'Finalizar Ejercicio' : 'Siguiente'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FillInTheBlank;