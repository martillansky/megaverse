import { plainToClass } from 'class-transformer';
import {
  IsPort,
  IsString,
  IsUrl,
  Matches,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsPort()
  PORT: string;

  @IsString()
  @Matches(
    /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/,
  )
  CANDIDATE_ID: string;

  @IsUrl()
  BASE_URL: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
