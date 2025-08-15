"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  analyzeTrafficFlow,
  type AnalyzeTrafficFlowInput,
  type AnalyzeTrafficFlowOutput,
} from "@/ai/flows/adaptive-traffic-flow";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Ban, Route } from "lucide-react";

const formSchema = z.object({
  roadNetwork: z.string().min(10, "Please describe the road network."),
  trafficIncidents: z.string().min(10, "Please describe any incidents."),
  vehicleTypes: z.string().min(5, "Please list the vehicle types."),
  currentSignalTiming: z.string().min(5, "Please describe signal timings."),
});

export function AiOptimizer() {
  const [result, setResult] = useState<AnalyzeTrafficFlowOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AnalyzeTrafficFlowInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roadNetwork: "Standard four-way intersection with two lanes in each direction.",
      trafficIncidents: "Minor congestion on the eastbound lane due to rush hour.",
      vehicleTypes: "Mix of cars, buses, and a few lorries.",
      currentSignalTiming: "North-South green for 30s, East-West green for 30s.",
    },
  });

  const onSubmit: SubmitHandler<AnalyzeTrafficFlowInput> = async (values) => {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await analyzeTrafficFlow(values);
      setResult(output);
      toast({
        title: "Analysis Complete",
        description: "AI has generated new traffic flow suggestions.",
      });
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get suggestions from AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="roadNetwork"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Road Network</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trafficIncidents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Traffic Incidents</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="vehicleTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Vehicle Types</FormLabel>
                <FormControl>
                  <Textarea rows={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="currentSignalTiming"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Current Signal Timing</FormLabel>
                <FormControl>
                  <Textarea rows={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Analyze & Optimize"
            )}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="space-y-4 pt-4">
            <h3 className="font-semibold">AI Suggestions</h3>
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                    <Lightbulb className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-base">Signal Timing</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-sm text-muted-foreground">
                    {result.suggestedSignalTiming}
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                    <Ban className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-base">Lane Restrictions</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-sm text-muted-foreground">
                    {result.suggestedLaneRestrictions}
                </CardContent>
             </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                    <Route className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-base">Congestion</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-sm text-muted-foreground">
                    {result.congestionIndicators}
                </CardContent>
             </Card>
        </div>
      )}
    </div>
  );
}
