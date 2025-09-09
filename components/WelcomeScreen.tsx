import React, { useState } from 'react';

interface WelcomeScreenProps {
    onStart: (name: string, teacherEmail: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !email.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return;
        }
        onStart(name.trim(), email.trim());
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
            <h1 className="text-3xl font-bold text-center text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Repaso de Español A2</h1>
            <p className="text-center text-slate-500 mt-2 mb-8">Introduce tus datos para empezar</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm"
                        placeholder="Ej: Ana García"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo del Profesor/a</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm"
                        placeholder="Ej: profesor@email.com"
                    />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="pt-2">
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Comenzar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WelcomeScreen;