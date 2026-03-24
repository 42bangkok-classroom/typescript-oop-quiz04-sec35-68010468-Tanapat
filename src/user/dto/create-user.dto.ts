import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName should not be empty' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'lastName should not be empty' })
  @IsString()
  lastName: string;

  email: string;
  username: string;
}
