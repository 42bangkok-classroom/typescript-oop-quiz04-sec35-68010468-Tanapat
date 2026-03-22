import { Controller, Get , Param , Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService : UserService) {}

  @Get('test')
  gettest() {
    return this.userService.test();
  }
  users(){
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(
    @Param('id') id: string, 
    @Query('fields') fields?: string
  ) {
    // ถ้ามีการส่ง fields มา (เช่น fields=firstName,lastName) ให้แยก string ด้วยเครื่องหมายลูกน้ำเป็น Array
    const fieldsArray = fields ? fields.split(',') : undefined;
    
    // เรียกใช้ service
    return this.userService.findOne(id, fieldsArray);
  }
}
