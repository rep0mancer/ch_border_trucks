import { Item, FamilyBandConfig } from './types';

export type Bands = {
  EUP_stacked: Item[];
  EUP_unstacked: Item[];
  DIN_stacked: Item[];
  DIN_unstacked: Item[];
};

export function expandUnits(items: Item[]): Item[] {
  const expandedUnits: Item[] = [];

  for (const originalItem of items) {
    const quantity: number = typeof originalItem.qty === 'number' && originalItem.qty > 0 ? originalItem.qty : 1;

    for (let unitIndex = 0; unitIndex < quantity; unitIndex += 1) {
      const unit: Item = { ...originalItem, qty: 1 };
      expandedUnits.push(unit);
    }
  }

  return expandedUnits;
}

export function splitIntoBands(allItems: Item[], famCfgs: FamilyBandConfig[]): Bands {
  const units: Item[] = expandUnits(allItems);

  const familyToStackableCount: Record<'EUP' | 'DIN', number> = {
    EUP: 0,
    DIN: 0,
  };

  for (const cfg of famCfgs) {
    familyToStackableCount[cfg.family] = Math.max(0, cfg.stackableCount);
  }

  const eupUnits: Item[] = units.filter((unit) => unit.family === 'EUP');
  const dinUnits: Item[] = units.filter((unit) => unit.family === 'DIN');

  const eupStackCount: number = Math.min(familyToStackableCount.EUP, eupUnits.length);
  const dinStackCount: number = Math.min(familyToStackableCount.DIN, dinUnits.length);

  return {
    EUP_stacked: eupUnits.slice(0, eupStackCount),
    EUP_unstacked: eupUnits.slice(eupStackCount),
    DIN_stacked: dinUnits.slice(0, dinStackCount),
    DIN_unstacked: dinUnits.slice(dinStackCount),
  };
}