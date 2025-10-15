
export interface VehicleData {
    engineTemp: number;
    oilPressure: number;
    rpm: number;
    fuelLevel: number;
    batteryVoltage: number;
    tirePressure: number;
    historicalRpm: { name: string; rpm: number }[];
}

export interface PredictionResult {
    predictedFault: string;
    affectedComponent: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    confidence: number;
    recommendation: string;
    faultCode: string;
}
