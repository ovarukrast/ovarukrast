
import React from 'react';
import { ActivityType } from '../types';
import ActivityCard from './ActivityCard';
import { BookOpenIcon, PencilIcon, ArrowsRightLeftIcon, ChatBubbleLeftRightIcon, ClockIcon, ChartBarIcon } from './icons';

interface WelcomeScreenProps {
    onStartActivity: (activityType: ActivityType) => void;
    error: string | null;
}

const activities = [
    { type: ActivityType.SerVsEstar, title: "Ser vs. Estar", description: "Elige la forma correcta de 'ser' o 'estar'.", icon: ChatBubbleLeftRightIcon },
    { type: ActivityType.FillInTheBlank, title: "Completar Huecos", description: "Rellena los espacios con la preposición correcta.", icon: PencilIcon },
    { type: ActivityType.VocabularyMatch, title: "Unir Vocabulario", description: "Empareja las palabras con sus definiciones.", icon: ArrowsRightLeftIcon },
    { type: ActivityType.ReadingComprehension, title: "Comprensión Lectora", description: "Lee un texto y responde a las preguntas.", icon: BookOpenIcon },
    { type: ActivityType.VerbTenses, title: "Tiempos Verbales", description: "Practica el pretérito indefinido y el imperfecto.", icon: ClockIcon },
    { type: ActivityType.VerbConjugation, title: "Conjugar Verbos", description: "Conjuga verbos irregulares en presente.", icon: ChartBarIcon },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartActivity, error }) => {
    return (
        <div className="container mx-auto px-4 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-2">Generador de Ejercicios de Español</h1>
                <p className="text-lg text-slate-600">Elige un tipo de ejercicio para empezar a practicar tu español con la ayuda de IA.</p>
            </header>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
                    <strong className="font-bold">¡Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity.type}
                            title={activity.title}
                            description={activity.description}
                            icon={<activity.icon className="h-8 w-8 text-blue-600" />}
                            onClick={() => onStartActivity(activity.type)}
                        />
                    ))}
                </div>
            </main>
            <footer className="text-center mt-16 text-slate-500">
                <p>Powered by Google Gemini API</p>
            </footer>
        </div>
    );
};

export default WelcomeScreen;
