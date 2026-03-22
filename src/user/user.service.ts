import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  test() {
    return [];
  }
  async findAll() {

  }
  
  findOne(id: string, fields?: string[]) {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    // eslint-disable-next-line
    const users: IUser[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (fields && fields.length > 0) {
      // ระบุ Type ให้ชัดเจนว่าเป็น Partial<IUser> เพื่อแก้ Error ลินเตอร์
      const filteredUser: Partial<IUser> = {};
      fields.forEach((field) => {
        const key = field as keyof IUser;
        if (user[key] !== undefined) {
          filteredUser[key] = user[key];
        }
      });
      return filteredUser;
    }

    return user;
  }
}
