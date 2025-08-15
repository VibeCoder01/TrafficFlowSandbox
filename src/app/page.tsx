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
            const isGreen =
              (vehicle.direction === 'vertical' && trafficLightState === 'ns-green') ||
              (vehicle.direction === 'horizontal' && trafficLightState === 'ew-green');

            const atLight = vehicle.progress > 45 && vehicle.progress < 55;

            if (atLight && !isGreen) {
              return vehicle; // Stop at red light
            }
            
            // Check for vehicles in front
            const nextProgress = vehicle.progress + 1;
            const vehicleInFront = currentVehicles.find(
              (otherVehicle) =>
                otherVehicle.id !== vehicle.id &&
                otherVehicle.direction === vehicle.direction &&
                otherVehicle.progress > vehicle.progress &&
                otherVehicle.progress <= nextProgress + 2 // 2 is vehicle length buffer
            );

            if (vehicleInFront) {
              return vehicle; // Stop for vehicle in front
            }

            return { ...vehicle, progress: nextProgress };
          })
          .filter((v) => v.progress < 100);
      });
    }, 100 - simulationSpeed);

    return () => clearInterval(simulationInterval);
  }, [simulationSpeed, trafficLightState]);

  return (
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <ControlPanel
          onAddVehicle={addVehicle}
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          trafficLightState={trafficLightState}
          onTrafficLightChange={setTrafficLightState}
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
