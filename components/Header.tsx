
import React from 'react';
import { CarIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 shadow-md p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <CarIcon className="h-8 w-8 text-cyan-500" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Intelligent Vehicle Fault Prediction System
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
