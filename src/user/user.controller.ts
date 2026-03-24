import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  gettest() {
    return this.userService.test();
  }

  @Get()
  findall() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields?: string) {
    let fieldsArray: string[] | undefined;

    if (fields) {
      fieldsArray = fields.split(',').map((field) => field.trim());
    }

    return this.userService.findOne(id, fieldsArray);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
