"use client";

import type { Vehicle, TrafficLightState } from "@/lib/types";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Car, Bus, Truck } from "lucide-react";
import { TrafficLightIcon } from "@/components/icons/traffic-light-icon";

interface ControlPanelProps {
  onAddVehicle: (type: Vehicle["type"]) => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  trafficLightState: TrafficLightState;
  onTrafficLightChange: (state: TrafficLightState) => void;
  nsGreenDuration: number;
  setNsGreenDuration: (duration: number) => void;
  ewGreenDuration: number;
  setEwGreenDuration: (duration: number) => void;
}

export function ControlPanel({
  onAddVehicle,
  simulationSpeed,
  onSpeedChange,
  trafficLightState,
  nsGreenDuration,
  setNsGreenDuration,
  ewGreenDuration,
  setEwGreenDuration
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
