import {
  MegaverseObject,
  MegaverseObjectType,
} from 'src/entities/megaverse.entity';

export enum MegaverseSoloonColor {
  blue,
  red,
  purple,
  white,
}

export class Soloon extends MegaverseObject {
  constructor(
    public candidateId: string,
    public objectAttribute: MegaverseSoloonColor,
    public row: number,
    public column: number,
  ) {
    super();
    this.objectType = MegaverseObjectType.soloon;
    this.objectAttribute = objectAttribute;
  }

  public convertionService(): string {
    return MegaverseSoloonColor[this.objectAttribute];
  }
}
