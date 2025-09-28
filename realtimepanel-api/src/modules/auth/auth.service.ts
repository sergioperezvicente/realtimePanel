import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import bcryptjs from 'node_modules/bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { WsService } from '../ws/ws.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FilesService } from '../files/files.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

const auth = new Logger('AuthService');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => WsService))
    private readonly wsService: WsService,
    private readonly filesService: FilesService,
    private readonly jwtService: JwtService,
  ) {
    this.createInitialUsers()
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      auth.error(`Not valid credentials: ${email}`)
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if (!user.password || !(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedException('Not valid credentials - password');
    }
    auth.debug(`User: ${email} logged`)
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        password: await bcryptjs.hash(password, 10),
        ...userData,
      });
      await this.userRepository.save(user);
      this.wsService.publishDBUpdated(`user-created: ${user.email}`)
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(`${createAuthDto.email} already exists`);
      }
      auth.fatal(`fatal error in service Auth`)
      throw new InternalServerErrorException('Something terrible happened!!');
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    auth.debug(`list of users returned`)
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { password } = changePasswordDto;

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return { message: 'user not-found' };
      }

      user.password = await bcryptjs.hash(password, 10);

      await this.userRepository.save(user);
      auth.debug(`user ${user.email} change password`)

      return { message: 'password changed success' };
    } catch (error) {
      console.error(error);
      return { message: 'password not changed' };
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
     auth.debug(`user-edited ${id}`)
     try {
      const user = await this.userRepository.findOne({ where: { id } })
      if (!user) {
        return { message: 'user not-found' };
      }

      if (updateAuthDto.password) {
        updateAuthDto.password = await bcryptjs.hash(
          updateAuthDto.password,
          10,
        );
      } else {
        updateAuthDto.password = user.password;
      }

      if (updateAuthDto.imageUrl && user.imageUrl) {
        this.filesService.deleteImage(user.imageUrl, 'avatars')
      }

      await this.userRepository.update(id, updateAuthDto);
      this.wsService.publishDBUpdated(`user-edited: ${user.id} at ${new Date()}`)

     } catch (error) {
      auth.error(`error on update user ${error}`)
     }
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('user not-found');
    }

    if (user.imageUrl) {
      this.filesService.deleteImage(user.imageUrl, 'avatars')
    }

    await this.userRepository.delete(id);
    this.wsService.publishDBUpdated(`user deleted: ${id}`)
  }

  async setOfflineTime(id: string){
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('user not-found');
    }

    await this.userRepository.update(id, { offline: new Date() });
    this.wsService.publishDBUpdated(`user loggout: ${id}`)
  }

  async createInitialUsers() {
    const users = await this.findAll();
    if (users.length !== 0) return;
    this.create({
      name: 'Administrador',
      lastName: '',
      email: 'admin@admin.com',
      password: 'admin1234',
      job: 'Administrador del sistema',
      imageUrl: '',
      phone: '',
      isAdmin: true,
      access: ['/'],
      offline: new Date()
    })
    this.create({
      name: 'Usuario',
      lastName: '',
      email: 'user@user.com',
      password: 'user1234',
      job: 'Usuario del sistema',
      imageUrl: '',
      phone: '',
      isAdmin: false,
      access: ['/','/settings'],
      offline: new Date()
    })
    auth.log('Usuarios iniciales creados')
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
