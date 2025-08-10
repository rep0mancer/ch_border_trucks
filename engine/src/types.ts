export interface Item {
  id?: string;
  family: 'EUP' | 'DIN';
  qty?: number; // defaults to 1 when omitted
  // Allow additional properties without strict typing, carried through splitting
  [key: string]: any;
}

export interface FamilyBandConfig {
  family: 'EUP' | 'DIN';
  stackableCount: number;   // units allowed to be stacked for this job
  maxStackHeight: number;   // default 2
}

export interface PackOptions {
  enforceRowPairConsistency: boolean;
  aisleReserve?: number;         // mm at doors
  frontStagingDepth: number;     // mm, stacked allowed only in [0..frontStagingDepth]
  blockStrategy: 'fixed';        // fixed policy
  fixedSequence: Array<'DIN_stacked' | 'EUP_stacked' | 'DIN_unstacked' | 'EUP_unstacked'>;
}

export interface TruckPreset {
  id: string;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  [key: string]: any;
}

export interface PlanResult {
  // Minimal shape; actual fields provided by the packing implementation
  steps?: any[];
  meta?: any;
  [key: string]: any;
}