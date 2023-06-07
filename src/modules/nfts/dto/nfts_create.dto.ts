import { IsNotEmpty, IsOptional } from 'class-validator';
import { CoolDownEnum } from '../types/coolDown.enum';

export class NftsCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsOptional()
  projectProductId?: string;

  @IsOptional()
  projectUserId?: string;

  @IsOptional()
  discountPercentage?: number;

  @IsOptional()
  coolDown?: CoolDownEnum;
}
