export type VehicleType = 'car' | 'bus' | 'lorry';

export interface Vehicle {
  id: string;
  type: VehicleType;
  progress: number; // 0 to 100
  direction: 'horizontal' | 'vertical';
}

export type TrafficLightState = 'ns-green' | 'ew-green';
