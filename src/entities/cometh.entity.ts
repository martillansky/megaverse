import {
  MegaverseObject,
  MegaverseObjectType,
} from 'src/entities/megaverse.entity';

export enum MegaverseComethDirection {
  up,
  down,
  left,
  right,
}

export class Cometh extends MegaverseObject {
  constructor(
    public candidateId: string,
    public objectAttribute: MegaverseComethDirection,
    public row: number,
    public column: number,
  ) {
    super();
    this.objectType = MegaverseObjectType.cometh;
    this.objectAttribute = objectAttribute;
  }

  public convertionService(): string {
    return MegaverseComethDirection[this.objectAttribute];
  }
}
