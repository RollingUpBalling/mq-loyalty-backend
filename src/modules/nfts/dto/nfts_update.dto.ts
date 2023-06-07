import { IsOptional, IsNotEmpty } from 'class-validator';
import { CoolDownEnum } from '../types/coolDown.enum';

export class NftsUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
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
