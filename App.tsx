
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PredictionPanel from './components/PredictionPanel';
import type { VehicleData, PredictionResult } from './types';
import { predictFault } from './services/geminiService';

const generateInitialData = (): VehicleData => ({
    engineTemp: 90,
    oilPressure: 40,
    rpm: 800,
    fuelLevel: 75,
    batteryVoltage: 12.6,
    tirePressure: 32,
    historicalRpm: Array.from({ length: 20 }, (_, i) => ({ name: `T-${20-i}`, rpm: 800 + Math.random() * 100 })),
});

const App: React.FC = () => {
    const [vehicleData, setVehicleData] = useState<VehicleData>(generateInitialData());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setVehicleData(prevData => {
                const newRpm = Math.max(700, prevData.rpm + (Math.random() - 0.5) * 500);
                const newHistoricalRpm = [...prevData.historicalRpm.slice(1), { name: 'Now', rpm: newRpm }];

                return {
                    engineTemp: Math.min(120, Math.max(85, prevData.engineTemp + (Math.random() - 0.45) * 5)),
                    oilPressure: Math.min(80, Math.max(30, prevData.oilPressure + (Math.random() - 0.5) * 5)),
                    rpm: newRpm,
                    fuelLevel: Math.max(0, prevData.fuelLevel - 0.1),
                    batteryVoltage: 12.4 + Math.random() * 0.4,
                    tirePressure: Math.min(45, Math.max(25, prevData.tirePressure + (Math.random() - 0.5) * 1)),
                    historicalRpm: newHistoricalRpm,
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleRunPrediction = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const result = await predictFault(vehicleData);
            setPrediction(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [vehicleData]);
    
    // Function to inject faulty data for demonstration
    const simulateFault = () => {
        setVehicleData(prevData => ({
            ...prevData,
            engineTemp: 115,
            oilPressure: 25,
            batteryVoltage: 11.9,
            tirePressure: 26,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Dashboard vehicleData={vehicleData} />
                    </div>
                    <div className="lg:col-span-1">
                        <PredictionPanel
                            isLoading={isLoading}
                            prediction={prediction}
                            error={error}
                            onPredict={handleRunPrediction}
                            onSimulateFault={simulateFault}
                        />
                    </div>
                </div>
            </main>
            <footer className="text-center p-4 text-gray-500 text-sm">
                <p>&copy; 2024 Automotive AI Diagnostics. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
