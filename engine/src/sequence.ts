import { Bands, splitIntoBands } from './bands';
import { PackOptions, PlanResult, FamilyBandConfig, TruckPreset, Item } from './types';
import { formColumns, applyFrontZoneDowngrade } from './stacking';
import { packBandSequence } from './packer';

export function planWithFixedSequence(
  items: Item[],
  famCfgs: FamilyBandConfig[],
  preset: TruckPreset,
  opts: PackOptions
): PlanResult {
  // a) build bands (units)
  const initialBands: Bands = splitIntoBands(items, famCfgs);

  // b) transform stacked units → columns
  //    Note: column formation details are delegated; here we only convert the stacked-unit lists.
  const stackedAsColumns: Bands = {
    ...initialBands,
    EUP_stacked: formColumns(initialBands.EUP_stacked, famCfgs),
    DIN_stacked: formColumns(initialBands.DIN_stacked, famCfgs),
  } as unknown as Bands;

  // c) enforce stacked-only front zone via downgrade
  const zoneCompliantBands: Bands = applyFrontZoneDowngrade(stackedAsColumns, preset, opts);

  // d) pack in fixed sequence (skip empty bands)
  const sequenceOrder = opts.fixedSequence;
  const orderedNonEmptyBands: Array<{ key: keyof Bands; items: Item[] }> = [];

  for (const key of sequenceOrder) {
    const bandKey = key as keyof Bands;
    const bandItems = zoneCompliantBands[bandKey] as unknown as Item[];
    if (Array.isArray(bandItems) && bandItems.length > 0) {
      orderedNonEmptyBands.push({ key: bandKey, items: bandItems });
    }
  }

  const result: PlanResult = packBandSequence(orderedNonEmptyBands, preset, opts);
  return result;
}