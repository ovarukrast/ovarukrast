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
            className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 w-full border border-slate-100"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
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