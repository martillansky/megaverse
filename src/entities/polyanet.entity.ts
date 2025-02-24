import {
  MegaverseObject,
  MegaverseObjectType,
} from 'src/entities/megaverse.entity';

export class Polyanet extends MegaverseObject {
  constructor(
    public candidateId: string,
    public row: number,
    public column: number,
  ) {
    super();
    this.objectType = MegaverseObjectType.polyanet;
  }
}
