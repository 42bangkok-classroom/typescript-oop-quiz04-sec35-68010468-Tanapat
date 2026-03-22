import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  gettest() {
    return this.userService.test();
  }
  users() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields?: string) {
    const fieldsArray = fields ? fields.split(',') : undefined;
    return this.userService.findOne(id, fieldsArray);
  }
}
