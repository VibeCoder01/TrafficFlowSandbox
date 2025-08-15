"use client";

import type { Vehicle, TrafficLightState } from "@/lib/types";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AiOptimizer } from "@/components/controls/ai-optimizer";
import { Car, Bus, Truck, TrafficSignal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  onAddVehicle: (type: Vehicle["type"]) => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  trafficLightState: TrafficLightState;
  onTrafficLightChange: (state: TrafficLightState) => void;
}

export function ControlPanel({
  onAddVehicle,
  simulationSpeed,
  onSpeedChange,
  trafficLightState,
  onTrafficLightChange,
}: ControlPanelProps) {
  return (
    <>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Controls</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vehicle Spawner</SidebarGroupLabel>
          <SidebarGroupContent className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              className="flex-col h-16"
              onClick={() => onAddVehicle("car")}
            >
              <Car className="mb-1" /> Car
            </Button>
            <Button
              variant="outline"
              className="flex-col h-16"
              onClick={() => onAddVehicle("bus")}
            >
              <Bus className="mb-1" /> Bus
            </Button>
            <Button
              variant="outline"
              className="flex-col h-16"
              onClick={() => onAddVehicle("lorry")}
            >
              <Truck className="mb-1" /> Lorry
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Simulation Controls</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            <div>
                <Label htmlFor="speed-slider">Simulation Speed</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        id="speed-slider"
                        min={1}
                        max={99}
                        step={1}
                        value={[simulationSpeed]}
                        onValueChange={(value) => onSpeedChange(value[0])}
                    />
                    <span className="text-sm font-medium tabular-nums w-8 text-right">{simulationSpeed}</span>
                </div>
            </div>
             <div>
                <Label>Traffic Lights</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                        variant={trafficLightState === 'ns-green' ? 'secondary' : 'outline'}
                        onClick={() => onTrafficLightChange('ns-green')}>
                        N-S Green
                    </Button>
                    <Button 
                        variant={trafficLightState === 'ew-green' ? 'secondary' : 'outline'}
                        onClick={() => onTrafficLightChange('ew-green')}>
                        E-W Green
                    </Button>
                </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
                <TrafficSignal className="h-4 w-4 text-primary" />
                AI Traffic Optimizer
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <AiOptimizer />
            </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </>
  );
}
