
import React, { useState } from 'react';
import { ReadingComprehensionExercise, UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ReadingComprehensionProps {
    exercise: ReadingComprehensionExercise;
    onFinish: (answers: UserAnswer[]) => void;
}

const ReadingComprehension: React.FC<ReadingComprehensionProps> = ({ exercise, onFinish }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleOptionChange = (questionIndex: number, option: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleFinish = () => {
        const results: UserAnswer[] = exercise.questions.map((q, index) => ({
            questionIndex: index,
            answer: answers[index] || "",
            isCorrect: answers[index] === q.correctAnswer,
        }));
        onFinish(results);
    };

    const isAllAnswered = Object.keys(answers).length === exercise.questions.length;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-slate-600 mb-6">Lee el siguiente texto y responde a las preguntas.</p>
            
            <div className="bg-slate-50 p-6 rounded-lg mb-8 prose prose-slate max-w-none">
                <p>{exercise.text}</p>
            </div>

            <div className="space-y-8">
                {exercise.questions.map((q, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === q.correctAnswer;
                    
                    return (
                        <div key={index}>
                            <p className="text-lg font-semibold text-slate-700 mb-4">{index + 1}. {q.question}</p>
                            <div className="space-y-3">
                                {q.options.map(option => {
                                    const isSelected = userAnswer === option;
                                    let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 flex items-center ";
                                    if (submitted) {
                                        if (option === q.correctAnswer) {
                                            buttonClass += "bg-green-100 border-green-400 text-green-800";
                                        } else if (isSelected && !isCorrect) {
                                            buttonClass += "bg-red-100 border-red-400 text-red-800";
                                        } else {
                                            buttonClass += "bg-slate-50 border-slate-200 text-slate-600";
                                        }
                                    } else {
                                        buttonClass += isSelected 
                                            ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300" 
                                            : "bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400";
                                    }

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => !submitted && handleOptionChange(index, option)}
                                            disabled={submitted}
                                            className={buttonClass}
                                        >
                                            {submitted && (
                                                option === q.correctAnswer ? <CheckCircleIcon className="h-5 w-5 mr-3 text-green-500" /> :
                                                (isSelected && !isCorrect ? <XCircleIcon className="h-5 w-5 mr-3 text-red-500" /> : <div className="h-5 w-5 mr-3"></div>)
                                            )}
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
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
                        disabled={!isAllAnswered}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300"
                    >
                        Revisar Respuestas
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReadingComprehension;
