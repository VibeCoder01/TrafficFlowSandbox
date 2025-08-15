
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

const LANES: Lane[] = ['north', 'south', 'east', 'west'];
const VEHICLE_LENGTH_BUFFER = 5; // Spacing between vehicles
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
          // Check if there's a vehicle at the start of the lane
          const vehicleAtStart = currentVehicles.find(v => v.lane === lane && v.progress < VEHICLE_LENGTH_BUFFER);
          
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
            
            // Intersection boundaries
            const intersectionStart = 46;
            const intersectionEnd = 54;
            const stopLine = 45;

            // Check traffic light
            const isVertical = vehicle.lane === 'north' || vehicle.lane === 'south';
            const isHorizontal = vehicle.lane === 'east' || vehicle.lane === 'west';

            const canGo = 
              (isVertical && (trafficLightState === 'ns-green' || trafficLightState === 'ns-amber')) ||
              (isHorizontal && (trafficLightState === 'ew-green' || trafficLightState === 'ew-amber'));

            const isGreen =
              (isVertical && trafficLightState === 'ns-green') ||
              (isHorizontal && trafficLightState === 'ew-green');
            
            // Stop at red/red-amber light before the intersection
            if (vehicle.progress >= stopLine && vehicle.progress < intersectionStart && !canGo) {
              return { ...vehicle, progress: stopLine }; // Stop at the line
            }

            // At an amber light, stop if you can, but proceed if you're too close to stop safely
            const isAmber = trafficLightState === 'ns-amber' || trafficLightState === 'ew-amber';
            if (isAmber && vehicle.progress >= stopLine - 5 && vehicle.progress < intersectionStart) {
              // This is a simplification; a real check would involve speed and distance.
              // Here, we'll make them stop if they are at the line.
               if(vehicle.progress === stopLine) return { ...vehicle, progress: stopLine };
            }


            // Check for vehicles in front in the same lane.
            const vehicleInFront = currentVehicles.find((other) => {
              if (other.id === vehicle.id || other.lane !== vehicle.lane) return false;
              
              // Check if the other vehicle is ahead and within stopping distance
              return other.progress > vehicle.progress && other.progress <= vehicle.progress + VEHICLE_LENGTH_BUFFER;
            });

            // Stop for vehicle in front
            if (vehicleInFront) {
              return { ...vehicle, progress: vehicleInFront.progress - VEHICLE_LENGTH_BUFFER };
            }

            // Yellow box junction logic: Don't enter intersection unless exit is clear
            if (vehicle.progress < intersectionStart && nextProgress >= intersectionStart && isGreen) {
              const vehicleBlockingExit = currentVehicles.find(
                (other) =>
                  other.id !== vehicle.id &&
                  other.lane === vehicle.lane && // Check only own lane
                  other.progress >= intersectionEnd &&
                  other.progress < intersectionEnd + VEHICLE_LENGTH_BUFFER
              );
              if (vehicleBlockingExit) {
                return { ...vehicle, progress: stopLine }; // Wait at the stop line
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
