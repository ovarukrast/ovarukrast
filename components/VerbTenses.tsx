
import React, { useState } from 'react';
import { VerbTensesExercise, VerbConjugationExercise, UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface VerbTensesProps {
    exercise: VerbTensesExercise | VerbConjugationExercise;
    onFinish: (answers: UserAnswer[]) => void;
}

const VerbTenses: React.FC<VerbTensesProps> = ({ exercise, onFinish }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (questionIndex: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleFinish = () => {
        const results: UserAnswer[] = exercise.questions.map((q, index) => {
            const userAnswer = (answers[index] || "").trim().toLowerCase();
            const correctAnswer = q.correctAnswer.trim().toLowerCase();
            return {
                questionIndex: index,
                answer: answers[index] || "",
                isCorrect: userAnswer === correctAnswer,
            };
        });
        onFinish(results);
    };
    
    const isAllAnswered = exercise.questions.every((_, index) => answers[index] && answers[index].trim() !== "");

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{exercise.title}</h2>
            <p className="text-slate-600 mb-8">{exercise.instructions}</p>

            <div className="space-y-6">
                {exercise.questions.map((q, index) => {
                    const isCorrect = submitted && (answers[index] || "").trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    const sentenceParts = q.sentence.split('___');
                    
                    return (
                        <div key={index}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <p className="text-lg text-slate-700 mb-2 sm:mb-0 flex-grow">
                                    {index + 1}. {sentenceParts[0]}
                                    <input
                                        type="text"
                                        value={answers[index] || ''}
                                        onChange={(e) => !submitted && handleInputChange(index, e.target.value)}
                                        disabled={submitted}
                                        className={`inline-block w-32 mx-2 p-1 border-b-2 focus:outline-none transition-colors ${
                                            submitted 
                                                ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                                                : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        aria-label={`Respuesta para la frase ${index + 1}`}
                                    />
                                    {sentenceParts[1]}
                                </p>
                                <p className="text-sm text-slate-500 self-start sm:self-center">
                                    ({q.verb} - {q.tense}, <span className="italic text-gray-400">{q.greekVerb}</span>)
                                </p>
                                {submitted && (
                                    <div className="flex-shrink-0 mt-2 sm:mt-0">
                                        {isCorrect ? (
                                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-6 w-6 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                             {submitted && !isCorrect && (
                                <p className="text-sm text-green-700 mt-2 ml-4">Respuesta correcta: <span className="font-semibold">{q.correctAnswer}</span></p>
                            )}
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

export default VerbTenses;
