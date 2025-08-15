
"use client";

import type { TrafficLightState, VehicleType } from "@/lib/types";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Car, Bus, Truck } from "lucide-react";
import { TrafficLightIcon } from "@/components/icons/traffic-light-icon";

type SpawnProbabilities = Record<VehicleType, number>;

interface ControlPanelProps {
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  nsGreenDuration: number;
  setNsGreenDuration: (duration: number) => void;
  ewGreenDuration: number;
  setEwGreenDuration: (duration: number) => void;
  spawnProbabilities: SpawnProbabilities;
  setSpawnProbabilities: (probs: SpawnProbabilities) => void;
}

export function ControlPanel({
  simulationSpeed,
  onSpeedChange,
  nsGreenDuration,
  setNsGreenDuration,
  ewGreenDuration,
  setEwGreenDuration,
  spawnProbabilities,
  setSpawnProbabilities
}: ControlPanelProps) {

  const handleProbChange = (type: VehicleType, value: number) => {
    const newProbs = { ...spawnProbabilities, [type]: value / 100 };
    
    // Normalize probabilities so they sum to 1
    const totalProb = Object.values(newProbs).reduce((sum, p) => sum + p, 0);
    if (totalProb > 0) {
      for (const key in newProbs) {
        (newProbs as any)[key] = (newProbs as any)[key] / totalProb;
      }
    }

    setSpawnProbabilities(newProbs);
  };

  return (
    <>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Controls</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vehicle Spawn Probability</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
             <div>
               <Label htmlFor="car-prob-slider" className="text-xs flex items-center gap-2"><Car className="h-4 w-4" /> Car</Label>
               <div className="flex items-center gap-4">
                   <Slider
                       id="car-prob-slider"
                       min={0}
                       max={100}
                       step={1}
                       value={[Math.round(spawnProbabilities.car * 100)]}
                       onValueChange={(value) => handleProbChange("car", value[0])}
                   />
                   <span className="text-sm font-medium tabular-nums w-12 text-right">{Math.round(spawnProbabilities.car * 100)}%</span>
               </div>
             </div>
              <div>
               <Label htmlFor="bus-prob-slider" className="text-xs flex items-center gap-2"><Bus className="h-4 w-4" /> Bus</Label>
               <div className="flex items-center gap-4">
                   <Slider
                       id="bus-prob-slider"
                       min={0}
                       max={100}
                       step={1}
                       value={[Math.round(spawnProbabilities.bus * 100)]}
                       onValueChange={(value) => handleProbChange("bus", value[0])}
                   />
                   <span className="text-sm font-medium tabular-nums w-12 text-right">{Math.round(spawnProbabilities.bus * 100)}%</span>
               </div>
             </div>
             <div>
               <Label htmlFor="lorry-prob-slider" className="text-xs flex items-center gap-2"><Truck className="h-4 w-4" /> Lorry</Label>
               <div className="flex items-center gap-4">
                   <Slider
                       id="lorry-prob-slider"
                       min={0}
                       max={100}
                       step={1}
                       value={[Math.round(spawnProbabilities.lorry * 100)]}
                       onValueChange={(value) => handleProbChange("lorry", value[0])}
                   />
                   <span className="text-sm font-medium tabular-nums w-12 text-right">{Math.round(spawnProbabilities.lorry * 100)}%</span>
               </div>
             </div>
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
                <Label className="flex items-center gap-2"><TrafficLightIcon className="h-4 w-4 text-primary" /> Traffic Light Cycle</Label>
                <div className="space-y-2 pt-2">
                   <div>
                     <Label htmlFor="ns-duration-slider" className="text-xs">N-S Green Duration</Label>
                     <div className="flex items-center gap-4">
                         <Slider
                             id="ns-duration-slider"
                             min={1000}
                             max={10000}
                             step={500}
                             value={[nsGreenDuration]}
                             onValueChange={(value) => setNsGreenDuration(value[0])}
                         />
                         <span className="text-sm font-medium tabular-nums w-12 text-right">{(nsGreenDuration / 1000).toFixed(1)}s</span>
                     </div>
                   </div>
                    <div>
                     <Label htmlFor="ew-duration-slider" className="text-xs">E-W Green Duration</Label>
                     <div className="flex items-center gap-4">
                         <Slider
                             id="ew-duration-slider"
                             min={1000}
                             max={10000}
                             step={500}
                             value={[ewGreenDuration]}
                             onValueChange={(value) => setEwGreenDuration(value[0])}
                         />
                         <span className="text-sm font-medium tabular-nums w-12 text-right">{(ewGreenDuration / 1000).toFixed(1)}s</span>
                     </div>
                   </div>
                </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
