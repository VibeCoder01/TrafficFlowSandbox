'use server';

/**
 * @fileOverview An AI agent for analyzing traffic flow and suggesting optimizations.
 *
 * - analyzeTrafficFlow - A function that analyzes traffic flow and suggests optimizations.
 * - AnalyzeTrafficFlowInput - The input type for the analyzeTrafficFlow function.
 * - AnalyzeTrafficFlowOutput - The return type for the analyzeTrafficFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrafficFlowInputSchema = z.object({
  roadNetwork: z
    .string()
    .describe('A description of the road network, including segments and junctions.'),
  trafficIncidents: z
    .string()
    .describe('A description of any traffic incidents, such as accidents or congestion.'),
  vehicleTypes: z
    .string()
    .describe('A description of the vehicle types on the road (e.g., cars, buses, lorries).'),
  currentSignalTiming: z
    .string()
    .describe('The current traffic signal timings at junctions.'),
});
export type AnalyzeTrafficFlowInput = z.infer<typeof AnalyzeTrafficFlowInputSchema>;

const AnalyzeTrafficFlowOutputSchema = z.object({
  suggestedSignalTiming: z
    .string()
    .describe('Suggested optimal traffic signal timings for junctions.'),
  suggestedLaneRestrictions: z
    .string()
    .describe('Suggested lane restrictions based on traffic analysis.'),
  congestionIndicators: z
    .string()
    .describe('Visual feedback on traffic conditions: show congestion levels.'),
});
export type AnalyzeTrafficFlowOutput = z.infer<typeof AnalyzeTrafficFlowOutputSchema>;

export async function analyzeTrafficFlow(input: AnalyzeTrafficFlowInput): Promise<AnalyzeTrafficFlowOutput> {
  return analyzeTrafficFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTrafficFlowPrompt',
  input: {schema: AnalyzeTrafficFlowInputSchema},
  output: {schema: AnalyzeTrafficFlowOutputSchema},
  prompt: `You are an expert traffic planner. Analyze the real-time road use, traffic incidents, and vehicle types on the road network to suggest optimal signal timing and lane restrictions to dynamically improve traffic flow.

Road Network: {{{roadNetwork}}}
Traffic Incidents: {{{trafficIncidents}}}
Vehicle Types: {{{vehicleTypes}}}
Current Signal Timing: {{{currentSignalTiming}}}

Based on this information, provide the following:

Suggested Signal Timing: (Provide suggested optimal traffic signal timings for junctions)
Suggested Lane Restrictions: (Provide suggested lane restrictions based on traffic analysis)
Congestion Indicators: (Visual feedback on traffic conditions: show congestion levels)`,
});

const analyzeTrafficFlowFlow = ai.defineFlow(
  {
    name: 'analyzeTrafficFlowFlow',
    inputSchema: AnalyzeTrafficFlowInputSchema,
    outputSchema: AnalyzeTrafficFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
