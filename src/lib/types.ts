
export type VehicleType = 'car' | 'bus' | 'lorry';

export type Lane = 'north' | 'south' | 'east' | 'west';

export interface Vehicle {
  id: string;
  type: VehicleType;
  progress: number; // 0 to 100
  lane: Lane;
}

export type TrafficLightState = 'ns-green' | 'ew-green';
