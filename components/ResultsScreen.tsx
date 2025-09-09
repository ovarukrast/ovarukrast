
import React, { useState, useMemo } from 'react';
import { Activity, UserAnswer, ActivityType, VocabularyMatchExercise, ReadingComprehensionExercise, SerVsEstarExercise, FillInTheBlankExercise, VerbTensesExercise } from '../types';
import { sendResultsEmail, EmailData } from '../services/emailService';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ResultsScreenProps {
    activity: Activity;
    userAnswers: UserAnswer[];
    onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ activity, userAnswers, onRestart }) => {
    const [teacherEmail, setTeacherEmail] = useState('');
    const [studentName, setStudentName] = useState('');
    const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isSending, setIsSending] = useState(false);

    const score = useMemo(() => {
        return userAnswers.filter(answer => answer.isCorrect).length;
    }, [userAnswers]);

    const totalQuestions = activity.type === ActivityType.VocabularyMatch ? (activity as VocabularyMatchExercise).items.length : (activity as Exclude<Activity, VocabularyMatchExercise>).questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    
    const getQuestionText = (index: number): string => {
        const questionHoldingActivity = activity as ReadingComprehensionExercise | SerVsEstarExercise | FillInTheBlankExercise | VerbTensesExercise;
        if (!questionHoldingActivity.questions) return "";
        const q = questionHoldingActivity.questions[index];
        if ('sentence' in q) return q.sentence;
        if ('question' in q) return q.question;
        return "";
    }

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setEmailStatus(null);
        
        const emailData: EmailData = {
            studentName,
            teacherEmail,
            activityName: activity.title,
            score,
            totalQuestions,
        };

        const result = await sendResultsEmail(emailData);
        setEmailStatus(result);
        setIsSending(false);
        if (result.success) {
            setTeacherEmail('');
            setStudentName('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-extrabold text-slate-800 text-center mb-2">¡Resultados!</h1>
                <p className="text-center text-slate-600 mb-6">Ejercicio: <span className="font-semibold">{activity.title}</span></p>

                <div className="text-center bg-blue-50 p-6 rounded-lg mb-8">
                    <p className="text-lg text-slate-700">Tu Puntuación</p>
                    <p className="text-6xl font-bold text-blue-600 my-2">{score} <span className="text-3xl font-medium text-slate-500">/ {totalQuestions}</span></p>
                    <p className="text-2xl font-semibold text-blue-800">{percentage}%</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Resumen de Respuestas</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {userAnswers.map(answer => {
                            const questionText = activity.type === ActivityType.VocabularyMatch 
                                ? `${(activity as VocabularyMatchExercise).items[answer.questionIndex].word} - ${(activity as VocabularyMatchExercise).items[answer.questionIndex].definition}`
                                : getQuestionText(answer.questionIndex);
                                
                            return (
                                <div key={answer.questionIndex} className="flex items-center text-sm p-3 bg-slate-50 rounded-md">
                                    {answer.isCorrect ? (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                    )}
                                    <span className="text-slate-600">{questionText.replace('___', `"${answer.answer}"`)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-100 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Enviar Resultados al Profesor</h3>
                    <form onSubmit={handleSendEmail} className="space-y-4">
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-slate-700">Tu Nombre</label>
                            <input type="text" id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="teacherEmail" className="block text-sm font-medium text-slate-700">Email del Profesor</label>
                            <input type="email" id="teacherEmail" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <button type="submit" disabled={isSending} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400">
                            {isSending ? 'Enviando...' : 'Enviar Correo'}
                        </button>
                    </form>
                    {emailStatus && (
                         <p className={`mt-4 text-sm text-center font-semibold ${emailStatus.success ? 'text-green-700' : 'text-red-700'}`}>{emailStatus.message}</p>
                    )}
                </div>

                <div className="text-center">
                    <button onClick={onRestart} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                        Hacer Otro Ejercicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsScreen;
