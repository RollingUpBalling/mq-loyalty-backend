import { IsOptional, IsNotEmpty } from 'class-validator';

export class UsersUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;
}
