import { IsNotEmpty, IsString } from 'class-validator';

export class GroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
