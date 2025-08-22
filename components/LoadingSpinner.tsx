
import React from 'react';

const messages = [
    "Plotting your course...",
    "Consulting the globetrotters...",
    "Packing your virtual bags...",
    "Crafting your perfect itinerary...",
    "Discovering hidden gems..."
];

export const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center flex flex-col items-center justify-center space-y-4 py-10">
            <div className="w-16 h-16 border-4 border-emerald-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-lg text-slate-300 font-medium">{message}</p>
        </div>
    );
};