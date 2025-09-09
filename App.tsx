// FIX: Implement the main App component to manage state and navigation
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ActivityCard from './components/ActivityCard';
import FillInTheBlank from './components/FillInTheBlank';
import SerVsEstar from './components/SerVsEstar';
import VocabularyMatch from './components/VocabularyMatch';
import ReadingComprehension from './components/ReadingComprehension';
import VerbTenses from './components/VerbTenses';
import { FillBlankIcon, SerEstarIcon, VocabularyIcon, ReadingIcon, VerbTenseIcon } from './components/icons';

type Activity = 'fill-blank' | 'ser-estar' | 'vocabulary' | 'reading' | 'verbs' | null;

interface User {
    name: string;
    teacherEmail: string;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentActivity, setCurrentActivity] = useState<Activity>(null);

    const handleStart = (name: string, teacherEmail: string) => {
        setUser({ name, teacherEmail });
    };

    const handleSelectActivity = (activity: Activity) => {
        setCurrentActivity(activity);
    };

    const handleBackToMenu = () => {
        setCurrentActivity(null);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <WelcomeScreen onStart={handleStart} />
            </div>
        );
    }

    const renderActivity = () => {
        if (!user) return null;

        switch (currentActivity) {
            case 'fill-blank':
                return <FillInTheBlank onBack={handleBackToMenu} user={user} />;
            case 'ser-estar':
                return <SerVsEstar onBack={handleBackToMenu} user={user} />;
            case 'vocabulary':
                return <VocabularyMatch onBack={handleBackToMenu} user={user} />;
            case 'reading':
                return <ReadingComprehension onBack={handleBackToMenu} user={user} />;
            case 'verbs':
                return <VerbTenses onBack={handleBackToMenu} user={user} />;
            default:
                return (
                    <div className="w-full max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">¡Hola, {user.name}!</h1>
                        <p className="text-center text-slate-500 mb-8">Elige una actividad para practicar.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ActivityCard
                                title="Completar la Frase"
                                description="Rellena los huecos en las frases."
                                icon={<FillBlankIcon />}
                                onClick={() => handleSelectActivity('fill-blank')}
                            />
                            <ActivityCard
                                title="Ser vs. Estar"
                                description="Elige el verbo correcto para cada situación."
                                icon={<SerEstarIcon />}
                                onClick={() => handleSelectActivity('ser-estar')}
                            />
                            <ActivityCard
                                title="Vocabulario"
                                description="Une las palabras en español con su traducción."
                                icon={<VocabularyIcon />}
                                onClick={() => handleSelectActivity('vocabulary')}
                            />
                            <ActivityCard
                                title="Comprensión Lectora"
                                description="Lee un texto y responde a las preguntas."
                                icon={<ReadingIcon />}
                                onClick={() => handleSelectActivity('reading')}
                            />
                             <ActivityCard
                                title="Tiempos Verbales"
                                description="Practica las conjugaciones de los verbos."
                                icon={<VerbTenseIcon />}
                                onClick={() => handleSelectActivity('verbs')}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            {renderActivity()}
        </div>
    );
};

export default App;
