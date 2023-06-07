import { IsNotEmpty, IsOptional } from 'class-validator';

export class UsersCreateDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsNotEmpty()
  phone: string;
}
