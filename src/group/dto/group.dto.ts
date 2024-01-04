import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class RoomDto {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
