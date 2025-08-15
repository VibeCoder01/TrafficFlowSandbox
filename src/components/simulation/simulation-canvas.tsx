
"use client";

import type { Vehicle, TrafficLightState, Lane } from "@/lib/types";
import { Car, Bus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { vehicleConfigs } from "@/lib/config";

const VehicleIcon = ({ type, lane }: { type: Vehicle["type"], lane: Lane }) => {
  const config = vehicleConfigs[type];
  const commonClasses = "text-foreground absolute";
  
  let rotationClass = '';
  switch (lane) {
    case 'north': rotationClass = 'rotate-0'; break;
    case 'south': rotationClass = 'rotate-180'; break;
    case 'west': rotationClass = '-rotate-90'; break;
    case 'east': rotationClass = 'rotate-90'; break;
  }
  
  const className = cn(commonClasses, config.className, rotationClass)

  switch (type) {
    case "car":
      return <Car className={className} />;
    case "bus":
      return <Bus className={className} />;
    case "lorry":
      return <Truck className={className} />;
  }
};

const TrafficLight = ({ state }: { state: 'red' | 'red-amber' | 'amber' | 'green' }) => (
    <div className="flex flex-col gap-1 rounded-md bg-zinc-800 p-1">
        <div className={cn("h-3 w-3 rounded-full", state === 'red' || state === 'red-amber' ? "bg-red-500 shadow-[0_0_5px_1px_#F44336]" : "bg-zinc-600")}></div>
        <div className={cn("h-3 w-3 rounded-full", state === 'amber' || state === 'red-amber' ? "bg-yellow-500 shadow-[0_0_5px_1px_#FFC107]" : "bg-zinc-600")}></div>
        <div className={cn("h-3 w-3 rounded-full", state === 'green' ? "bg-green-500 shadow-[0_0_5px_1px_#4CAF50]" : "bg-zinc-600")}></div>
    </div>
)

export function SimulationCanvas({ vehicles, trafficLightState }: { vehicles: Vehicle[], trafficLightState: TrafficLightState }) {
  const getVehiclePosition = (vehicle: Vehicle): React.CSSProperties => {
    // Road is 16 units wide. Centerline is at 50%.
    // Left-hand traffic. Lanes are ~4 units wide.
    // Lane centers:
    // Westbound (top-left): 50% - 4 units = ~47.5%
    // Eastbound (bottom-right): 50% + 4 units = ~52.5%
    // Northbound (top-left): 50% - 4 units = ~47.5%
    // Southbound (bottom-right): 50% + 4 units = ~52.5%
    const laneOffset = '2.5%'; // Adjusted for better centering
    
    switch(vehicle.lane) {
        case 'west': // top lane, left to right
            return { top: `calc(50% - ${laneOffset})`, left: `${vehicle.progress}%`, transform: 'translateY(-50%)' };
        case 'east': // bottom lane, right to left
            return { top: `calc(50% + ${laneOffset})`, left: `${100 - vehicle.progress}%`, transform: 'translateY(-50%)' };
        case 'north': // left lane, bottom to top
            return { top: `${100 - vehicle.progress}%`, left: `calc(50% - ${laneOffset})`, transform: 'translateX(-50%)' };
        case 'south': // right lane, top to bottom
            return { top: `${vehicle.progress}%`, left: `calc(50% + ${laneOffset})`, transform: 'translateX(-50%)' };
    }
  };

  const getLightState = (forLanes: 'ns' | 'ew'): 'red' | 'red-amber' | 'amber' | 'green' => {
    if (forLanes === 'ns') {
      switch (trafficLightState) {
        case 'ns-green': return 'green';
        case 'ns-amber': return 'amber';
        case 'ns-red-amber': return 'red-amber';
        default: return 'red';
      }
    } else { // forLanes === 'ew'
      switch (trafficLightState) {
        case 'ew-green': return 'green';
        case 'ew-amber': return 'amber';
        case 'ew-red-amber': return 'red-amber';
        default: return 'red';
      }
    }
  };

  return (
    <div className="h-full w-full">
        {/* Road Network */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 transform bg-card-foreground/30"></div>
            <div className="absolute top-1/2 left-0 w-full h-16 -translate-y-1/2 transform bg-card-foreground/30"></div>
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform bg-card-foreground/40">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="yellow-hatch" patternUnits="userSpaceOnUse" width="8" height="8">
                        <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#yellow-hatch)" />
                </svg>
            </div>
             <svg width="100%" height="100%" className="absolute inset-0">
                <line x1="0" y1="50%" x2="calc(50% - 32px)" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                <line x1="calc(50% + 32px)" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                
                <line x1="50%" y1="0" x2="50%" y2="calc(50% - 32px)" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                <line x1="50%" y1="calc(50% + 32px)" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="10 5" />


                {/* Stop Lines for Left-Hand Traffic */}
                {/* Westbound (top lane, approaching from left) */}
                <line x1="calc(50% - 40px)" y1="calc(50% - 32px)" x2="calc(50% - 40px)" y2="50%" stroke="white" strokeWidth="2" />
                {/* Eastbound (bottom lane, approaching from right) */}
                <line x1="calc(50% + 40px)" y1="50%" x2="calc(50% + 40px)" y2="calc(50% + 32px)" stroke="white" strokeWidth="2" />
                {/* Northbound (left lane, approaching from bottom) */}
                <line x1="calc(50% - 32px)" y1="calc(50% + 40px)" x2="50%" y2="calc(50% + 40px)" stroke="white" strokeWidth="2" />
                {/* Southbound (right lane, approaching from top) */}
                <line x1="50%" y1="calc(50% - 40px)" x2="calc(50% + 32px)" y2="calc(50% - 40px)" stroke="white" strokeWidth="2" />
             </svg>
        </div>

        {/* Traffic Lights */}
        {/* N/S Lights */}
        <div className="absolute top-[calc(50%+48px)] left-[calc(50%-80px)]"><TrafficLight state={getLightState('ns')}/></div>
        <div className="absolute top-[calc(50%-84px)] left-[calc(50%+48px)] rotate-180"><TrafficLight state={getLightState('ns')}/></div>
        
        {/* E/W Lights */}
        <div className="absolute top-[calc(50%+48px)] left-[calc(50%+48px)] -rotate-90"><TrafficLight state={getLightState('ew')}/></div>
        <div className="absolute top-[calc(50%-84px)] left-[calc(50%-80px)] rotate-90"><TrafficLight state={getLightState('ew')}/></div>

        {/* Vehicles */}
        {vehicles.map((vehicle) => (
            <div
            key={vehicle.id}
            className="absolute transition-all duration-100 ease-linear flex items-center justify-center"
            style={getVehiclePosition(vehicle)}
            >
                <VehicleIcon type={vehicle.type} lane={vehicle.lane} />
            </div>
        ))}
    </div>
  );
}
