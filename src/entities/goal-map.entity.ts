import { MegaverseComethDirection } from './cometh.entity';
import { MegaverseEntityString } from './megaverse.entity';
import { MegaverseSoloonColor } from './soloon.entity';

export interface GoalMap {
  goal: Array<Array<MegaverseEntityString>>;
}

export type Entity = {
  type: number;
  color?: MegaverseSoloonColor;
  direction?: MegaverseComethDirection;
} | null;

export interface CurrentMap {
  map: {
    content: Entity[][];
  };
}
