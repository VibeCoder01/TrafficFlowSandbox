"use client";

import type { Vehicle, TrafficLightState } from "@/lib/types";
import { Car, Bus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const VehicleIcon = ({ type }: { type: Vehicle["type"] }) => {
  const commonClasses = "h-5 w-5 text-foreground";
  switch (type) {
    case "car":
      return <Car className={cn(commonClasses, "text-blue-400")} />;
    case "bus":
      return <Bus className={cn(commonClasses, "text-yellow-400 h-6 w-6")} />;
    case "lorry":
      return <Truck className={cn(commonClasses, "text-green-400 h-7 w-7")} />;
  }
};

const TrafficLight = ({ active }: { active: boolean }) => (
    <div className="flex flex-col gap-1 rounded-md bg-zinc-800 p-1">
        <div className={cn("h-3 w-3 rounded-full", active ? "bg-zinc-600" : "bg-red-500 shadow-[0_0_5px_1px_#F44336]")}></div>
        <div className={cn("h-3 w-3 rounded-full", active ? "bg-green-500 shadow-[0_0_5px_1px_#4CAF50]" : "bg-zinc-600")}></div>
    </div>
)

export function SimulationCanvas({ vehicles, trafficLightState }: { vehicles: Vehicle[], trafficLightState: TrafficLightState }) {
  const getVehiclePosition = (vehicle: Vehicle) => {
    if (vehicle.direction === 'horizontal') {
        return { top: `50%`, left: `${vehicle.progress}%`, transform: 'translate(-50%, -50%)' };
    } else {
        return { top: `${vehicle.progress}%`, left: `50%`, transform: 'translate(-50%, -50%) rotate(90deg)'};
    }
  };

  const nsGreen = trafficLightState === 'ns-green';
  const ewGreen = trafficLightState === 'ew-green';

  return (
    <div className="h-full w-full">
        {/* Road Network */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 transform bg-card-foreground/30"></div>
            <div className="absolute top-1/2 left-0 w-full h-16 -translate-y-1/2 transform bg-card-foreground/30"></div>
             <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform bg-card-foreground/40"></div>
             <svg width="100%" height="100%" className="absolute inset-0">
                <line x1="0" y1="50%" x2="calc(50% - 32px)" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 10" />
                <line x1="calc(50% + 32px)" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 10" />
                <line x1="50%" y1="0" x2="50%" y2="calc(50% - 32px)" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 10" />
                <line x1="50%" y1="calc(50% + 32px)" x2="50%" y2="100%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 10" />
             </svg>
        </div>

        {/* Traffic Lights */}
        <div className="absolute top-[calc(50%-48px)] left-[calc(50%+36px)]"><TrafficLight active={nsGreen}/></div>
        <div className="absolute top-[calc(50%+36px)] left-[calc(50%-48px)] rotate-180"><TrafficLight active={nsGreen}/></div>
        <div className="absolute top-[calc(50%+36px)] left-[calc(50%+36px)] -rotate-90"><TrafficLight active={ewGreen}/></div>
        <div className="absolute top-[calc(50%-48px)] left-[calc(50%-48px)] rotate-90"><TrafficLight active={ewGreen}/></div>


        {/* Vehicles */}
        {vehicles.map((vehicle) => (
            <div
            key={vehicle.id}
            className="absolute transition-all duration-100 ease-linear"
            style={getVehiclePosition(vehicle)}
            >
                <VehicleIcon type={vehicle.type} />
            </div>
        ))}
    </div>
  );
}
