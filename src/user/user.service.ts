import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  test() {
    return [] ;
  }
  async findAll(){
    
  }
  findOne(id: string, fields?: string[]) {
    // 1. อ่านข้อมูลจากไฟล์ (ถ้าคุณมี this.findAll() จากข้อ 3 แล้ว สามารถเรียกใช้แทน 2 บรรทัดนี้ได้เลย)
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const users: IUser[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 2. ค้นหา user ตาม id
    const user = users.find((u) => u.id === id);

    // 3. ถ้าไม่พบ user ให้ throw NotFoundException (404)
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 4. ถ้ามี Query Parameter fields ระบุมา ให้ทำการ Filter Fields
    if (fields && fields.length > 0) {
      const filteredUser = {};
      fields.forEach((field) => {
        // เช็คว่ามี field นี้ใน object user หรือไม่
        if (user[field as keyof IUser] !== undefined) {
          filteredUser[field] = user[field as keyof IUser];
        }
      });
      return filteredUser;
    }
    return user;
}
}
