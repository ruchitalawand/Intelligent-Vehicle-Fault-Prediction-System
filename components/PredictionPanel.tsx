
import React from 'react';
import type { PredictionResult } from '../types';
import { CogIcon, WarningIcon, CheckCircleIcon, LightBulbIcon } from './icons';

interface PredictionPanelProps {
    isLoading: boolean;
    prediction: PredictionResult | null;
    error: string | null;
    onPredict: () => void;
    onSimulateFault: () => void;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ isLoading, prediction, error, onPredict, onSimulateFault }) => {

    const getSeverityClass = (severity: PredictionResult['severity']) => {
        switch (severity) {
            case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500';
            case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
            case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500';
            default: return 'bg-gray-600/20 text-gray-400 border-gray-600';
        }
    };
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-white">AI Predictive Analysis</h3>
            <div className="flex-grow flex flex-col justify-center items-center text-center">
                {isLoading && (
                    <div className="space-y-4">
                        <CogIcon className="h-16 w-16 text-cyan-500 animate-spin mx-auto" />
                        <p className="text-lg text-gray-300">Analyzing vehicle data...</p>
                        <p className="text-sm text-gray-500">The AI is processing millions of data points to predict potential issues.</p>
                    </div>
                )}
                
                {error && (
                    <div className="space-y-4 p-4 bg-red-900/50 rounded-lg">
                        <WarningIcon className="h-12 w-12 text-red-400 mx-auto" />
                        <p className="text-lg text-red-300">Analysis Failed</p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}
                
                {prediction && (
                    <div className="space-y-4 w-full text-left">
                        <div className={`p-3 rounded-lg border ${getSeverityClass(prediction.severity)}`}>
                            <p className="font-bold text-lg">{prediction.predictedFault}</p>
                            <p className="text-sm">Severity: {prediction.severity}</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p><span className="font-semibold text-gray-400">Affected Component:</span> {prediction.affectedComponent}</p>
                            <p><span className="font-semibold text-gray-400">Fault Code:</span> {prediction.faultCode}</p>
                            <p><span className="font-semibold text-gray-400">Confidence:</span> {(prediction.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-cyan-900/50 p-3 rounded-lg">
                             <p className="font-semibold text-cyan-300 mb-1">Recommendation:</p>
                             <p>{prediction.recommendation}</p>
                        </div>
                    </div>
                )}
                
                {!isLoading && !prediction && !error && (
                    <div className="space-y-4">
                         <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                        <p className="text-lg text-gray-300">All Systems Nominal</p>
                        <p className="text-sm text-gray-500">No faults detected based on current data. Run a deep analysis for a full system check.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-6 space-y-3">
                 <button 
                    onClick={onPredict}
                    disabled={isLoading}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <CogIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Analyzing...' : 'Run Predictive Analysis'}
                </button>
                 <button 
                    onClick={onSimulateFault}
                    disabled={isLoading}
                    className="w-full bg-yellow-600/50 hover:bg-yellow-500/50 text-yellow-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center text-sm"
                >
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Simulate Fault Data
                </button>
            </div>
        </div>
    );
};

export default PredictionPanel;
