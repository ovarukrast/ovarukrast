import React, { useState, useMemo } from 'react';
import { UserAnswer } from '../types';
import { sendResultsEmail } from '../services/emailService';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ResultsScreenProps {
    activityTitle: string;
    userAnswers: UserAnswer[];
    studentName: string;
    teacherEmail: string;
    onRestart: () => void;
    completedActivities: Record<string, { score: number; total: number }>;
    totalActivities: number;
}

type EmailStatus = 'idle' | 'sending' | 'success' | 'error';

const activityTypeToTitle: Record<string, string> = {
    'ser-vs-estar': 'Ser vs. Estar',
    'fill-in-the-blank': 'Completar Espacios',
    'vocabulary-match': 'Emparejar Vocabulario',
    'reading-comprehension': 'Comprensión Lectora',
    'verb-tenses': 'Tiempos Verbales',
    'verb-conjugation': 'Conjugar Verbos',
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({
    activityTitle,
    userAnswers,
    studentName,
    teacherEmail,
    onRestart,
    completedActivities,
    totalActivities
}) => {
    const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
    const [emailMessage, setEmailMessage] = useState('');

    const score = useMemo(() => userAnswers.filter(answer => answer.isCorrect).length, [userAnswers]);
    const totalQuestions = userAnswers.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const numCompleted = Object.keys(completedActivities).length;
    const completionPercentage = totalActivities > 0 ? Math.round((numCompleted / totalActivities) * 100) : 0;

    const getScoreColor = (p: number) => {
        if (p >= 80) return 'text-green-600';
        if (p >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = async () => {
        setEmailStatus('sending');
        setEmailMessage('');
        try {
            const response = await sendResultsEmail({
                studentName,
                teacherEmail,
                activityName: activityTitle,
                score,
                totalQuestions,
            });
            if (response.success) {
                setEmailStatus('success');
                setEmailMessage(response.message);
            } else {
                setEmailStatus('error');
                setEmailMessage(response.message);
            }
        } catch (error) {
            setEmailStatus('error');
            setEmailMessage('Ocurrió un error inesperado al enviar el correo.');
        }
    };

    const renderEmailButton = () => {
        switch (emailStatus) {
            case 'sending':
                return (
                    <button className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-slate-400 cursor-not-allowed flex items-center justify-center" disabled>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </button>
                );
            case 'success':
                 return (
                    <div className="text-center">
                        <p className="flex items-center justify-center text-green-600"><CheckCircleIcon className="h-5 w-5 mr-2" /> {emailMessage}</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center">
                        <p className="flex items-center justify-center text-red-600"><XCircleIcon className="h-5 w-5 mr-2" /> {emailMessage}</p>
                        <button onClick={handleSendEmail} className="mt-2 text-sm text-indigo-600 hover:underline">Intentar de nuevo</button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <button onClick={handleSendEmail} className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Enviar resultados
                    </button>
                );
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
             <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 printable-area">
                <div className="text-center no-print">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">¡Resultados!</h2>
                    <p className="text-slate-500 mb-6">Aquí tienes un resumen de tu progreso, {studentName}.</p>
                </div>
                
                <div className="hidden print:block mb-8 text-center">
                    <h1 className="text-2xl font-bold">Informe de Resultados</h1>
                    <p className="text-lg">Estudiante: {studentName}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 my-8">
                    <div className="bg-slate-50 p-6 rounded-lg text-center flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Resultado de "{activityTitle}"</h3>
                        <p className={`text-6xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</p>
                        <p className="text-xl text-slate-600 mt-2">{score} / {totalQuestions} correctas</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-slate-700 mb-4 text-center">Progreso General</h3>
                        <p className="text-slate-600 text-center">Has completado {numCompleted} de {totalActivities} actividades.</p>
                        <div className="w-full bg-slate-200 rounded-full h-4 my-4">
                            <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                        <p className="text-2xl font-bold text-green-600 text-center">{completionPercentage}% Completado</p>
                    </div>
                </div>

                <div className="hidden print:block mt-8">
                    <h3 className="text-xl font-bold mb-4">Desglose de Puntuaciones</h3>
                    <ul className="list-disc list-inside text-left">
                        {Object.entries(completedActivities).map(([key, result]) => (
                            <li key={key} className="mb-2 text-lg">
                                <span className="font-semibold">{activityTypeToTitle[key] || key}:</span> {result.score} / {result.total}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:flex-row-reverse sm:justify-center sm:space-x-4 sm:space-x-reverse no-print">
                    <button onClick={onRestart} className="w-full sm:w-auto px-6 py-3 border border-slate-300 rounded-lg shadow-sm text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Elegir otra actividad
                    </button>
                    <button onClick={handlePrint} className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                        Imprimir
                    </button>
                </div>
                
                 <div className="mt-8 pt-6 border-t border-slate-200 no-print">
                    {renderEmailButton()}
                </div>
            </div>
        </div>
    );
};

export default ResultsScreen;
