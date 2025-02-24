import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComethService } from './comeths/cometh.service';
import { Cometh, MegaverseComethDirection } from './entities/cometh.entity';
import { GoalMap } from './entities/goal-map.entity';
import {
  MegaverseEntityString,
  MegaverseObject,
  MegaverseObjectType,
} from './entities/megaverse.entity';
import { Polyanet } from './entities/polyanet.entity';
import { MegaverseSoloonColor, Soloon } from './entities/soloon.entity';
import { EnvironmentVariables } from './env/validation';
import { GoalMapService } from './goal-map/goal-map.service';
import { PolyanetService } from './polyanets/polyanet.service';
import { SoloonService } from './soloons/soloon.service';
import { sleep } from './utils';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  candidateID = this.configService.get('CANDIDATE_ID', {
    infer: true,
  });
  constructor(
    private readonly goalMapService: GoalMapService,
    private readonly polyanetService: PolyanetService,
    private readonly soloonService: SoloonService,
    private readonly comethService: ComethService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  private async prepareMegaverse(): Promise<string> {
    this.logger.log('READING GOAL MAP');
    return await this.goalMapService
      .getGoalMap()
      .then(async (goalMap) => {
        this.logger.log('GOAL MAP: ' + goalMap.goal);
        this.logger.log('CREATING MEGAVERSE');

        return await this.createMegaverse(goalMap.goal)
          .then((res) => {
            this.logger.log('MEGAVERSE CREATED!');
            return 'MEGAVERSE CREATED!';
          })
          .catch((err) => {
            this.logger.error(err.message);
            return 'UNEXPECTED ERROR!';
          });
      })
      .catch((err) => {
        this.logger.error(err.message);
        return 'UNEXPECTED ERROR!';
      });
  }

  private createEntity(
    candidateId: string,
    encodedEntity: MegaverseEntityString,
    row: number,
    col: number,
  ): MegaverseObject | null {
    const entityStrings: string[] = encodedEntity.split('_');
    var entityType: MegaverseObjectType;
    if (entityStrings.length > 1) {
      entityType = MegaverseObjectType[entityStrings[1].toLowerCase()];
    } else {
      entityType = MegaverseObjectType[entityStrings[0].toLowerCase()];
    }
    if (entityType === MegaverseObjectType.soloon) {
      return new Soloon(
        candidateId,
        MegaverseSoloonColor[entityStrings[0].toLowerCase()],
        row,
        col,
      );
    } else if (entityType === MegaverseObjectType.cometh) {
      return new Cometh(
        candidateId,
        MegaverseComethDirection[entityStrings[0].toLowerCase()],
        row,
        col,
      );
    } else if (entityType === MegaverseObjectType.polyanet) {
      return new Polyanet(candidateId, row, col);
    }
    return null; // Space
  }

  private async createMegaverse(goalMap: GoalMap['goal']): Promise<boolean> {
    // Process each row sequentially
    for (let row = 0; row < goalMap.length; row++) {
      const goalMapCol = goalMap[row];
      // Process each column sequentially
      for (let col = 0; col < goalMapCol.length; col++) {
        const goalMapObj = goalMapCol[col];

        const megaverseObj: MegaverseObject | null = this.createEntity(
          this.candidateID,
          goalMapObj,
          row,
          col,
        );
        if (megaverseObj === null) {
          continue;
        }

        try {
          if (megaverseObj instanceof Polyanet) {
            await this.polyanetService.postPolyanet(megaverseObj as Polyanet);
          } else if (megaverseObj instanceof Soloon) {
            await this.soloonService.postSoloon(megaverseObj as Soloon);
          } else if (megaverseObj instanceof Cometh) {
            await this.comethService.postCometh(megaverseObj as Cometh);
          }
        } catch (err) {
          this.logger.error(
            `Failed to create ${megaverseObj.constructor.name} at row ${row}, col ${col}`,
          );
          throw err;
        }
      }
    }
    return true;
  }

  private async emptyMegaverse(): Promise<string> {
    this.logger.log('EMPTYING CURRENT MAP');

    try {
      const goalMap = await this.goalMapService.getCurrentMap();

      for (let i = 0; i < goalMap.map.content.length; i++) {
        const rows = goalMap.map.content[i];
        for (let j = 0; j < rows.length; j++) {
          const colObj = rows[j];

          if (typeof colObj?.type === 'number') {
            try {
              if (
                MegaverseObjectType[colObj?.type] ===
                MegaverseObjectType[MegaverseObjectType.polyanet]
              ) {
                await this.polyanetService.deletePolyanet(
                  new Polyanet(this.candidateID, i, j),
                );
              } else if (
                MegaverseObjectType[colObj?.type] ===
                MegaverseObjectType[MegaverseObjectType.cometh]
              ) {
                await this.comethService.deleteCometh(
                  new Cometh(
                    this.candidateID,
                    MegaverseComethDirection.up,
                    i,
                    j,
                  ),
                );
              } else if (
                MegaverseObjectType[colObj?.type] ===
                MegaverseObjectType[MegaverseObjectType.soloon]
              ) {
                await this.soloonService.deleteSoloon(
                  new Soloon(this.candidateID, MegaverseSoloonColor.blue, i, j),
                );
              }
            } catch (err) {
              this.logger.error(
                `Failed to delete ${MegaverseObjectType[colObj?.type]} at row ${i}, col ${j}`,
              );
              throw err;
            }
            await sleep(); // Add delay between to avoid too many requests error
          }
        }
      }

      this.logger.log('MEGAVERSE EMPTIED!');
      return 'OK';
    } catch (err) {
      this.logger.error(err.message);
      return 'UNEXPECTED ERROR!';
    }
  }

  async initMegaverse(): Promise<string> {
    await this.emptyMegaverse();
    return await this.prepareMegaverse();
  }
}
