
"use client";

import * as React from "react";
import type { Vehicle, TrafficLightState, VehicleType, Lane } from "@/lib/types";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/header";
import { ControlPanel } from "@/components/controls/control-panel";
import { SimulationCanvas } from "@/components/simulation/simulation-canvas";
import { v4 as uuidv4 } from 'uuid';
import { vehicleConfigs } from "@/lib/config";

const LANES: Lane[] = ['north', 'south', 'east', 'west'];
const AMBER_DURATION = 2000;
const RED_AMBER_DURATION = 2000;


export default function Home() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [simulationSpeed, setSimulationSpeed] = React.useState(50);
  const [trafficLightState, setTrafficLightState] =
    React.useState<TrafficLightState>("ns-green");
  const [nsGreenDuration, setNsGreenDuration] = React.useState(5000);
  const [ewGreenDuration, setEwGreenDuration] = React.useState(5000);
  
  const [spawnProbabilities, setSpawnProbabilities] = React.useState({
    car: 0.8,
    bus: 0.1,
    lorry: 0.1,
  });


  const getVehicleTypeFromProb = (): VehicleType => {
    const rand = Math.random();
    let cumulativeProb = 0;

    for (const type in spawnProbabilities) {
      cumulativeProb += spawnProbabilities[type as VehicleType];
      if (rand < cumulativeProb) {
        return type as VehicleType;
      }
    }
    return 'car'; // Fallback
  }

  // Auto-spawning vehicles
  React.useEffect(() => {
    const spawnInterval = setInterval(() => {
      setVehicles(currentVehicles => {
        const newVehicles: Vehicle[] = [];
        
        LANES.forEach(lane => {
          const vehicleLength = vehicleConfigs[getVehicleTypeFromProb()].length;
          const vehicleAtStart = currentVehicles.find(v => v.lane === lane && v.progress < vehicleLength);
          
          if (!vehicleAtStart && Math.random() < 0.1) { // 10% chance to spawn each tick if lane is clear
            const type = getVehicleTypeFromProb();
            newVehicles.push({
              id: uuidv4(),
              type,
              progress: 0,
              lane: lane,
            });
          }
        });

        return [...currentVehicles, ...newVehicles];
      });
    }, 500); // Attempt to spawn every 500ms

    return () => clearInterval(spawnInterval);
  }, [spawnProbabilities]);

  // Simulation main loop
  React.useEffect(() => {
    const simulationInterval = setInterval(() => {
      setVehicles((currentVehicles) => {
        return currentVehicles
          .map((vehicle) => {
            let nextProgress = vehicle.progress + 1;
            const vehicleConfig = vehicleConfigs[vehicle.type];
            const vehicleLength = vehicleConfig.length;
            
            const intersectionStart = 46;
            const intersectionEnd = 54;
            const stopLine = 45;

            const isVertical = vehicle.lane === 'north' || vehicle.lane === 'south';
            const isHorizontal = vehicle.lane === 'east' || vehicle.lane === 'west';

            const canGo = 
              (isVertical && (trafficLightState === 'ns-green' || trafficLightState === 'ns-amber')) ||
              (isHorizontal && (trafficLightState === 'ew-green' || trafficLightState === 'ew-amber'));
            
            // Logic for stopping at red/amber lights
            if (vehicle.progress >= stopLine && vehicle.progress < intersectionStart && !canGo) {
              return { ...vehicle, progress: stopLine }; 
            }

            // Logic for stopping just before intersection if amber, unless too close to stop
            const isAmber = trafficLightState === 'ns-amber' || trafficLightState === 'ew-amber';
            if (isAmber && vehicle.progress >= stopLine - 5 && vehicle.progress < stopLine) {
               // don't slam on brakes, proceed
            } else if (isAmber && vehicle.progress >= stopLine && vehicle.progress < intersectionStart) {
               return { ...vehicle, progress: stopLine };
            }

            // Collision detection with vehicle in front
            const vehicleInFront = currentVehicles.find((other) => {
              if (other.id === vehicle.id || other.lane !== vehicle.lane) return false;
              // Check if 'other' is ahead of 'vehicle' and within a certain distance
              return other.progress > vehicle.progress && other.progress < vehicle.progress + vehicleLength + 2; // +2 for spacing
            });

            if (vehicleInFront) {
               const frontVehicleConfig = vehicleConfigs[vehicleInFront.type];
               const requiredHeadway = frontVehicleConfig.length + 2; // +2 for spacing
               const newProgress = vehicleInFront.progress - requiredHeadway;
               // Ensure progress doesn't go backward
               return { ...vehicle, progress: Math.max(vehicle.progress, newProgress) };
            }

            // "Yellow box junction" logic: don't enter intersection if exit isn't clear
            if (vehicle.progress < stopLine && nextProgress >= stopLine && canGo) {
                const vehicleBlockingExit = currentVehicles.find(
                    (other) =>
                    other.lane === vehicle.lane &&
                    other.progress >= intersectionEnd &&
                    other.progress < intersectionEnd + vehicleConfigs[other.type].length + 2 // +2 for spacing
                );
                if (vehicleBlockingExit) {
                    return { ...vehicle, progress: stopLine }; // Stop at the line
                }
            }
            
            return { ...vehicle, progress: nextProgress };
          })
          .filter((v) => v.progress < 100);
      });
    }, 100 - simulationSpeed);

    return () => clearInterval(simulationInterval);
  }, [simulationSpeed, trafficLightState]);

  // Traffic light cycle manager
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const sequence: Record<TrafficLightState, { next: TrafficLightState; duration: number }> = {
      'ns-green': { next: 'ns-amber', duration: nsGreenDuration },
      'ns-amber': { next: 'ew-red-amber', duration: AMBER_DURATION },
      'ew-red-amber': { next: 'ew-green', duration: RED_AMBER_DURATION },
      'ew-green': { next: 'ew-amber', duration: ewGreenDuration },
      'ew-amber': { next: 'ns-red-amber', duration: AMBER_DURATION },
      'ns-red-amber': { next: 'ns-green', duration: RED_AMBER_DURATION },
    };

    const lightCycle = () => {
      const { next, duration } = sequence[trafficLightState];
      setTrafficLightState(next);
      timeoutId = setTimeout(lightCycle, duration);
    };

    timeoutId = setTimeout(lightCycle, sequence[trafficLightState].duration);

    return () => clearTimeout(timeoutId);
  }, [trafficLightState, nsGreenDuration, ewGreenDuration]);


  return (
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <ControlPanel
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          nsGreenDuration={nsGreenDuration}
          setNsGreenDuration={setNsGreenDuration}
          ewGreenDuration={ewGreenDuration}
          setEwGreenDuration={setEwGreenDuration}
          spawnProbabilities={spawnProbabilities}
          setSpawnProbabilities={setSpawnProbabilities}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-svh flex-col">
          <AppHeader />
          <main className="flex-1 overflow-hidden p-4 md:p-6">
            <div className="relative h-full w-full rounded-lg border bg-card shadow-inner">
              <SimulationCanvas vehicles={vehicles} trafficLightState={trafficLightState} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
