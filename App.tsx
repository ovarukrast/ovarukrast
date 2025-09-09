
import React, { useState, useCallback } from 'react';
import { Activity, ActivityType, UserAnswer, SerVsEstarExercise, FillInTheBlankExercise, VocabularyMatchExercise, ReadingComprehensionExercise, VerbTensesExercise, VerbConjugationExercise } from './types';
import { generateActivity } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingSpinner from './components/LoadingSpinner';
import SerVsEstar from './components/SerVsEstar';
import FillInTheBlank from './components/FillInTheBlank';
import VocabularyMatch from './components/VocabularyMatch';
import ReadingComprehension from './components/ReadingComprehension';
import VerbTenses from './components/VerbTenses';
import ResultsScreen from './components/ResultsScreen';


const App: React.FC = () => {
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleStartActivity = useCallback(async (activityType: ActivityType) => {
        setIsLoading(true);
        setError(null);
        setCurrentActivity(null);
        setUserAnswers([]);
        setShowResults(false);
        try {
            const activity = await generateActivity(activityType);
            setCurrentActivity(activity);
        } catch (err) {
            setError('Failed to generate the activity. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFinishActivity = (answers: UserAnswer[]) => {
        setUserAnswers(answers);
        setShowResults(true);
    };

    const handleRestart = () => {
        setCurrentActivity(null);
        setUserAnswers([]);
        setShowResults(false);
        setError(null);
    };

    const renderActivity = () => {
        if (!currentActivity) return null;

        switch (currentActivity.type) {
            case ActivityType.SerVsEstar:
                return <SerVsEstar exercise={currentActivity as SerVsEstarExercise} onFinish={handleFinishActivity} />;
            case ActivityType.FillInTheBlank:
                return <FillInTheBlank exercise={currentActivity as FillInTheBlankExercise} onFinish={handleFinishActivity} />;
            case ActivityType.VocabularyMatch:
                 return <VocabularyMatch exercise={currentActivity as VocabularyMatchExercise} onFinish={handleFinishActivity} />;
            case ActivityType.ReadingComprehension:
                return <ReadingComprehension exercise={currentActivity as ReadingComprehensionExercise} onFinish={handleFinishActivity} />;
            case ActivityType.VerbTenses:
            case ActivityType.VerbConjugation: // Both use the same component
                return <VerbTenses exercise={currentActivity as VerbTensesExercise | VerbConjugationExercise} onFinish={handleFinishActivity} />;
            default:
                // This case should not be reached with valid data
                return <p>Unknown activity type.</p>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }
    
    if (showResults && currentActivity) {
        return <ResultsScreen activity={currentActivity} userAnswers={userAnswers} onRestart={handleRestart} />;
    }

    if (currentActivity) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {renderActivity()}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
             <WelcomeScreen onStartActivity={handleStartActivity} error={error} />
        </div>
    );
};

export default App;
