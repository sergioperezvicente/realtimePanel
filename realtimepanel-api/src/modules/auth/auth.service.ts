import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import bcryptjs from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if (!user.password || !(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedException('Not valid credentials - password');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // async create(createAuthDto: CreateAuthDto) {
  //   try {
  //     const { password, ...userData } = createAuthDto;

  //     const user = this.userRepository.create({
  //       password: await bcryptjs.hash(password, 10),
  //       ...userData,
  //     });
  //     await this.userRepository.save(user);
  //     const { password: _, ...userWithoutPassword } = user;

  //     return userWithoutPassword;
  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new BadRequestException(`${createAuthDto.email} already exists`);
  //     }
  //     throw new InternalServerErrorException('Something terrible happened!!');
  //   }
  // }

  // async findAll(): Promise<Partial<User>[]> {
  //   const users = await this.userRepository.find();
  //   return users.map(
  //     ({ password, ...userWithoutPassword }) => userWithoutPassword,
  //   );
  // }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // async remove(id: string): Promise<void> {
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new Error('Usuario no encontrado');
  //   }

  //   // if (user.imageUrl && !user.imageUrl.includes('default.png')) {
  //   //   const filename = user.imageUrl.split('/').pop();
  //   //   const imagePath = join(
  //   //     __dirname,
  //   //     '..',
  //   //     '..',
  //   //     'public',
  //   //     'images',
  //   //     'users',
  //   //     filename,
  //   //   );

  //   //   if (fs.existsSync(imagePath)) {
  //   //     fs.unlinkSync(imagePath);
  //   //   }
  //   // }

  //   await this.userRepository.delete(id);
  // }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
