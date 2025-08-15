"use client";

import * as React from "react";
import type { Vehicle, TrafficLightState } from "@/lib/types";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/header";
import { ControlPanel } from "@/components/controls/control-panel";
import { SimulationCanvas } from "@/components/simulation/simulation-canvas";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [simulationSpeed, setSimulationSpeed] = React.useState(50);
  const [trafficLightState, setTrafficLightState] =
    React.useState<TrafficLightState>("ns-green");
  const [nsGreenDuration, setNsGreenDuration] = React.useState(3000); // 3 seconds
  const [ewGreenDuration, setEwGreenDuration] = React.useState(3000); // 3 seconds


  const addVehicle = (type: Vehicle["type"]) => {
    const newVehicle: Vehicle = {
      id: uuidv4(),
      type,
      progress: 0,
      direction: Math.random() > 0.5 ? 'horizontal' : 'vertical',
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  React.useEffect(() => {
    const simulationInterval = setInterval(() => {
      setVehicles((currentVehicles) => {
        return currentVehicles
          .map((vehicle) => {
            const nextProgress = vehicle.progress + 1;
            
            // Intersection boundaries
            const intersectionStart = 46;
            const intersectionEnd = 54;
            const stopLine = 45;

            // Check traffic light
            const isGreen =
              (vehicle.direction === 'vertical' && trafficLightState === 'ns-green') ||
              (vehicle.direction === 'horizontal' && trafficLightState === 'ew-green');

            // 1. Stop at red light before the intersection
            if (vehicle.progress === stopLine && !isGreen) {
              return vehicle;
            }

            // Check for vehicles in front
            const vehicleInFront = currentVehicles.find(
              (otherVehicle) =>
                otherVehicle.id !== vehicle.id &&
                otherVehicle.direction === vehicle.direction &&
                otherVehicle.progress > vehicle.progress &&
                otherVehicle.progress <= nextProgress + 2 // 2 is vehicle length buffer
            );
            
            // 2. Stop for vehicle in front
            if (vehicleInFront) {
              return vehicle;
            }

            // 3. Yellow box junction logic: Don't enter intersection unless exit is clear
            if (vehicle.progress < intersectionStart && nextProgress >= intersectionStart) {
              const vehicleBlockingExit = currentVehicles.find(
                (other) =>
                  other.id !== vehicle.id &&
                  other.direction === vehicle.direction &&
                  other.progress >= intersectionEnd &&
                  other.progress < intersectionEnd + 3 // Buffer beyond intersection
              );
              if (vehicleBlockingExit) {
                return vehicle; // Wait for exit to be clear
              }
            }
            
            return { ...vehicle, progress: nextProgress };
          })
          .filter((v) => v.progress < 100);
      });
    }, 100 - simulationSpeed);

    return () => clearInterval(simulationInterval);
  }, [simulationSpeed, trafficLightState, vehicles]); // Added vehicles to dependency array for more responsive checks

  React.useEffect(() => {
    const lightCycle = () => {
      setTrafficLightState(currentState => {
        if (currentState === 'ns-green') {
          return 'ew-green';
        } else {
          return 'ns-green';
        }
      });
    };

    const intervalId = setInterval(lightCycle, trafficLightState === 'ns-green' ? nsGreenDuration : ewGreenDuration);

    return () => clearInterval(intervalId);
  }, [trafficLightState, nsGreenDuration, ewGreenDuration]);

  return (
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <ControlPanel
          onAddVehicle={addVehicle}
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          trafficLightState={trafficLightState}
          onTrafficLightChange={setTrafficLightState}
          nsGreenDuration={nsGreenDuration}
          setNsGreenDuration={setNsGreenDuration}
          ewGreenDuration={ewGreenDuration}
          setEwGreenDuration={setEwGreenDuration}
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
