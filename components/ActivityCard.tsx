
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
            className="group block text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
                    <p className="text-slate-500">{description}</p>
                </div>
            </div>
        </button>
    );
};

export default ActivityCard;
