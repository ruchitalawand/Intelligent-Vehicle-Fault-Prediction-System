
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    max: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, max }) => {
    const numericValue = Number(value);
    const percentage = (numericValue / max) * 100;

    let color = '#06b6d4'; // cyan
    if (percentage > 85) color = '#f59e0b'; // amber
    if (percentage > 95) color = '#ef4444'; // red

    const data = [{ name: title, value: numericValue }];

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center">
            <h4 className="text-md font-semibold text-gray-400 mb-2">{title}</h4>
            <div style={{ width: '100%', height: 100 }}>
                 <ResponsiveContainer>
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        barSize={10}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, max]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            angleAxisId={0}
                            fill={color}
                            cornerRadius={5}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-2xl font-bold text-white -mt-10">{value}</p>
            <p className="text-sm text-gray-500">{unit}</p>
        </div>
    );
};

export default MetricCard;
