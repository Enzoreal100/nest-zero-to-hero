import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
    const { username, password } = authCredentialsDTO;
    const salt = await bcrypt.genSalt();
    const passwordEncrypted = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      password: passwordEncrypted,
    });

    try {
      await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`CODE ${err.code}`);
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return `User with username ${user.username} created sucessfully!`;
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    const verify = await this.userRepository.findOne({
      where: { username },
    });
    if (verify && (await bcrypt.compare(password, verify.password))) {
      this.logger.log('Login done');
      const payload: IJwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      this.logger.error('Error on credentials');
      throw new UnauthorizedException('Check your credentials');
    }
  }
}
