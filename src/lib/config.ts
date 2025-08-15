import type { VehicleType } from './types';

export const vehicleConfigs: Record<VehicleType, { length: number; className: string }> = {
  car: {
    length: 5,
    className: 'h-5 w-5 text-blue-400',
  },
  bus: {
    length: 7,
    className: 'h-7 w-7 text-yellow-400',
  },
  lorry: {
    length: 8,
    className: 'h-8 w-8 text-green-400',
  },
};
