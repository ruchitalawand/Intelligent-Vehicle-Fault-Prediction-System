
import { GoogleGenAI, Type } from "@google/genai";
import type { VehicleData, PredictionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This is a fallback for development and will be displayed in the UI.
    // In a real environment, the key would be set.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_API_KEY' });

export const predictFault = async (data: VehicleData): Promise<PredictionResult> => {
     if (!API_KEY || API_KEY === 'MISSING_API_KEY') {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    
    const prompt = `
        You are an advanced AI diagnostics system for a modern vehicle.
        Based on the following real-time sensor data, predict the most likely potential component failure or required maintenance.
        Provide your analysis in a structured JSON format.

        Normal Operating Ranges:
        - Engine Temperature: 85-105°C
        - Oil Pressure: 30-60 PSI
        - Engine RPM: 700-4000 RPM (normal driving)
        - Battery Voltage: 12.4-12.8V (engine off), 13.7-14.7V (engine on)
        - Tire Pressure: 30-35 PSI

        Current Sensor Data:
        - Engine Temperature: ${data.engineTemp.toFixed(1)}°C
        - Oil Pressure: ${data.oilPressure.toFixed(1)} PSI
        - Engine RPM: ${data.rpm.toFixed(0)} RPM
        - Fuel Level: ${data.fuelLevel.toFixed(1)}%
        - Battery Voltage: ${data.batteryVoltage.toFixed(2)}V
        - Tire Pressure: ${data.tirePressure.toFixed(1)} PSI

        Analyze this data and identify the most critical upcoming issue.
        Consider how these values deviate from normal ranges and how they might correlate.
        For example, high engine temp and low oil pressure could indicate an oil leak or pump failure.
        Low battery voltage could indicate an alternator issue.
        Assign a standard automotive diagnostic fault code (e.g., P0300, C1221).
        Provide a clear, actionable recommendation for the driver or mechanic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        predictedFault: { type: Type.STRING, description: "A concise name for the predicted fault (e.g., 'Alternator Failure Imminent')." },
                        affectedComponent: { type: Type.STRING, description: "The primary vehicle system or component affected (e.g., 'Charging System')." },
                        severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'], description: "The urgency of the issue." },
                        confidence: { type: Type.NUMBER, description: "The model's confidence in this prediction, from 0.0 to 1.0." },
                        recommendation: { type: Type.STRING, description: "A clear, actionable recommendation for the user (e.g., 'Service vehicle immediately. Avoid driving.')." },
                        faultCode: { type: Type.STRING, description: "A plausible automotive Diagnostic Trouble Code (DTC), e.g., P0524."}
                    },
                    required: ["predictedFault", "affectedComponent", "severity", "confidence", "recommendation", "faultCode"]
                },
                 temperature: 0.2, // Lower temperature for more deterministic, fact-based output
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as PredictionResult;
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a prediction from the AI model. The model may be overloaded or an error occurred.");
    }
};
