import { IsOptional, IsNotEmpty } from 'class-validator';

export class ProductUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  image?: string;
}
