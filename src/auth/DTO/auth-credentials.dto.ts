import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password needs to be at least 8 characters long' })
  @MaxLength(32, { message: 'Password can be 32 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  }) // password needs: 1 uppercase, 1 lowercase, 1 num or special char and add a specific response for bad password
  password: string;
}
