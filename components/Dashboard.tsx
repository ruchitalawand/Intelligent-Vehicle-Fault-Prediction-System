
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { VehicleData } from '../types';
import MetricCard from './MetricCard';

interface DashboardProps {
    vehicleData: VehicleData;
}

const Dashboard: React.FC<DashboardProps> = ({ vehicleData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <MetricCard title="Engine Temp" value={vehicleData.engineTemp.toFixed(1)} unit="°C" max={120} />
                <MetricCard title="Oil Pressure" value={vehicleData.oilPressure.toFixed(1)} unit="PSI" max={100} />
                <MetricCard title="Battery Voltage" value={vehicleData.batteryVoltage.toFixed(2)} unit="V" max={16} />
                <MetricCard title="Tire Pressure" value={vehicleData.tirePressure.toFixed(1)} unit="PSI" max={50} />
                <MetricCard title="Fuel Level" value={vehicleData.fuelLevel.toFixed(1)} unit="%" max={100} />
                <MetricCard title="Engine RPM" value={vehicleData.rpm.toFixed(0)} unit="RPM" max={8000} />
            </div>
             <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Engine RPM (Live)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={vehicleData.historicalRpm} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#d1d5db' }}/>
                            <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} domain={[0, 8000]}/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2d3748',
                                    borderColor: '#4a5568'
                                }}
                                labelStyle={{ color: '#e5e7eb' }}
                            />
                            <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                            <Line type="monotone" dataKey="rpm" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
