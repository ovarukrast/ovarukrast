
import React from 'react';

interface ActivityCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, description, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 mt-1">{description}</p>
                </div>
            </div>
        </button>
    );
};

export default ActivityCard;
