import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-token')
  checkToken(@Request() req: Request) {
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user.id }),
    };
  }

  @Get('logout/:id')
  logout(@Param('id') id: string) {
    this.authService.setOfflineTime(id);
  }

  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @Post('users')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  @Patch('change-password/:id')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
