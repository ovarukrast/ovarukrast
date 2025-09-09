import React, { useState } from 'react';
import { Activity, ActivityType, UserAnswer } from './types';
import { generateActivity } from './services/geminiService';

import WelcomeScreen from './components/WelcomeScreen';
import ActivityCard from './components/ActivityCard';
import LoadingSpinner from './components/LoadingSpinner';
import SerVsEstar from './components/SerVsEstar';
import FillInTheBlank from './components/FillInTheBlank';
import VocabularyMatch from './components/VocabularyMatch';
import ReadingComprehension from './components/ReadingComprehension';
import VerbTenses from './components/VerbTenses';
import ResultsScreen from './components/ResultsScreen';

import {
    BookOpenIcon,
    PencilIcon,
    ArrowsRightLeftIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    ChartBarIcon
} from './components/icons';

type View = 'welcome' | 'activity-selection' | 'loading' | 'activity' | 'results';

const activityDetails = [
    { type: ActivityType.SerVsEstar, title: 'Ser vs. Estar', description: 'Elige la forma correcta del verbo.', icon: <ChatBubbleLeftRightIcon className="h-8 w-8" /> },
    { type: ActivityType.FillInTheBlank, title: 'Completar Espacios', description: 'Usa la palabra correcta para la frase.', icon: <PencilIcon className="h-8 w-8" /> },
    { type: ActivityType.VocabularyMatch, title: 'Emparejar Vocabulario', description: 'Conecta palabras con sus significados.', icon: <ArrowsRightLeftIcon className="h-8 w-8" /> },
    { type: ActivityType.ReadingComprehension, title: 'Comprensión Lectora', description: 'Lee un texto y responde preguntas.', icon: <BookOpenIcon className="h-8 w-8" /> },
    { type: ActivityType.VerbTenses, title: 'Tiempos Verbales', description: 'Conjuga verbos en diferentes tiempos.', icon: <ClockIcon className="h-8 w-8" /> },
    { type: ActivityType.VerbConjugation, title: 'Conjugar Verbos', description: 'Practica conjugaciones de verbos comunes.', icon: <ChartBarIcon className="h-8 w-8" /> },
];

const App: React.FC = () => {
    const [view, setView] = useState<View>('welcome');
    const [studentName, setStudentName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [completedActivities, setCompletedActivities] = useState<Record<string, { score: number; total: number }>>({});
    const [error, setError] = useState<string | null>(null);

    const handleStart = (name: string, email: string) => {
        setStudentName(name);
        setTeacherEmail(email);
        setView('activity-selection');
    };

    const handleSelectActivity = async (activityType: ActivityType) => {
        setView('loading');
        setError(null);
        try {
            const activity = await generateActivity(activityType);
            setCurrentActivity(activity);
            setView('activity');
        } catch (err) {
            setError('No se pudo generar el ejercicio. Por favor, inténtalo de nuevo.');
            setView('activity-selection');
        }
    };

    const handleCompleteActivity = (answers: UserAnswer[]) => {
        setUserAnswers(answers);
        if (currentActivity) {
            const score = answers.filter(a => a.isCorrect).length;
            const total = answers.length;
            setCompletedActivities(prev => ({
                ...prev,
                [currentActivity.type]: { score, total }
            }));
        }
        setView('results');
    };
    
    const handleRestart = () => {
        setCurrentActivity(null);
        setUserAnswers([]);
        setError(null);
        setView('activity-selection');
    };

    const renderActivity = () => {
        if (!currentActivity) return null;

        switch (currentActivity.type) {
            case ActivityType.SerVsEstar:
                return <SerVsEstar exercise={currentActivity} onComplete={handleCompleteActivity} />;
            case ActivityType.FillInTheBlank:
                return <FillInTheBlank exercise={currentActivity} onComplete={handleCompleteActivity} />;
            case ActivityType.VocabularyMatch:
                return <VocabularyMatch exercise={currentActivity} onComplete={handleCompleteActivity} />;
            case ActivityType.ReadingComprehension:
                return <ReadingComprehension exercise={currentActivity} onComplete={handleCompleteActivity} />;
            case ActivityType.VerbTenses:
            case ActivityType.VerbConjugation:
                return <VerbTenses exercise={currentActivity} onComplete={handleCompleteActivity} />;
            default:
                return <p>Tipo de actividad no reconocido.</p>;
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'welcome':
                return <WelcomeScreen onStart={handleStart} />;
            case 'activity-selection':
                return (
                    <div className="w-full max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">¡Hola, {studentName}!</h1>
                        <p className="text-center text-slate-500 mb-8">Elige una actividad para practicar tu español.</p>
                         {error && <p className="text-center text-red-500 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activityDetails.map(activity => (
                                <ActivityCard
                                    key={activity.type}
                                    title={activity.title}
                                    description={activity.description}
                                    icon={activity.icon}
                                    onClick={() => handleSelectActivity(activity.type)}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'loading':
                return <LoadingSpinner />;
            case 'activity':
                return renderActivity();
            case 'results':
                return (
                    <ResultsScreen
                        activityTitle={currentActivity?.title || 'Ejercicio'}
                        userAnswers={userAnswers}
                        studentName={studentName}
                        teacherEmail={teacherEmail}
                        onRestart={handleRestart}
                        completedActivities={completedActivities}
                        totalActivities={activityDetails.length}
                    />
                );
            default:
                return <WelcomeScreen onStart={handleStart} />;
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
            <div key={view} className="animate-fade-in w-full flex items-center justify-center">
                 {renderContent()}
            </div>
        </main>
    );
};

export default App;
