export enum MegaverseObjectType {
  polyanet,
  soloon,
  cometh,
  space,
}

export enum MegaverseEntityString {
  POLYANET = 'POLYANET',
  WHITE_SOLOON = 'WHITE_SOLOON',
  RED_SOLOON = 'RED_SOLOON',
  BLUE_SOLOON = 'BLUE_SOLOON',
  PURPLE_SOLOON = 'PURPLE_SOLOON',
  UP_COMETH = 'UP_COMETH',
  DOWN_COMETH = 'DOWN_COMETH',
  LEFT_COMETH = 'LEFT_COMETH',
  RIGHT_COMETH = 'RIGHT_COMETH',
  SPACE = 'SPACE',
}

export abstract class MegaverseObject {
  candidateId: string;
  objectType: MegaverseObjectType;
  objectAttribute?: number;
  row: number;
  column: number;

  convertionService?(): string;
}
