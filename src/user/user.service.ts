import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'users.json');
  test() {
    return [];
  }
  findAll(): IUser[] {
    try {
      // 1. ตรวจสอบก่อนว่าไฟล์มีอยู่จริงไหม (Optional แต่แนะนำ)
      if (!fs.existsSync(this.dataPath)) {
        console.warn(
          `File not found at ${this.dataPath}, returning empty array.`,
        );
        return [];
      }

      // 2. พยายามอ่านไฟล์
      const rawData = fs.readFileSync(this.dataPath, 'utf-8');

      // 3. พยายามแปลงเป็น JSON
      // ถ้า rawData ว่างเปล่า JSON.parse จะ Error เราเลยใส่เช็คสั้นๆ ไว้ด้วย
      const users = rawData ? (JSON.parse(rawData) as IUser[]) : [];

      return users;
    } catch (error) {
      // 4. ส่วนจัดการเมื่อเกิด Error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Error reading or parsing users file:', errorMessage);

      // ส่งค่า Default กลับไป (Array ว่าง) เพื่อให้โปรแกรมส่วนอื่นทำงานต่อได้โดยไม่พัง
      return [];
    }
  }

  findOne(id: string, fields?: string[]) {
    try {
      const users = this.findAll();
      const user = users.find((u) => String(u.id) === id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (fields) {
        const filteredUser: Partial<IUser> = {};

        fields.forEach((field) => {
          const key = field as keyof IUser;

          if (user[key] !== undefined) {
            filteredUser[key] = user[key] as never;
          }
        });

        return filteredUser;
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Cannot process user data');
    }
  }

  create(createUserDto: CreateUserDto) {
    try {
      // 1. อ่านข้อมูล User ทั้งหมดที่มีอยู่เดิม (เรียกใช้ findAll ของเดิมได้เลย)
      const users = this.findAll();

      // 2. สร้าง ID ใหม่ (หา ID ที่มากที่สุดแล้วบวก 1)
      let maxId = 0;
      if (users.length > 0) {
        // ดึงเฉพาะ id มาแปลงเป็นตัวเลข แล้วหาค่า max
        const ids = users.map((u) => parseInt(String(u.id), 10));
        maxId = Math.max(...ids);
      }
      const newId = String(maxId + 1);

      // 3. นำข้อมูลจาก DTO มารวมกับ ID ใหม่
      const newUser = {
        id: newId,
        ...createUserDto,
      };

      // 4. นำ User ใหม่ไปต่อท้าย Array เดิม
      // (ใช้ as unknown as IUser เพื่อบอก Typescript ให้ยอมรับโครงสร้างนี้ไปก่อน)
      users.push(newUser as unknown as IUser);

      // 5. แปลง Array กลับเป็น JSON String แล้วเขียนทับลงไปในไฟล์
      // (ใส่ null, 2 เพื่อให้ JSON ในไฟล์จัดหน้าสวยงาม อ่านง่าย)
      fs.writeFileSync(this.dataPath, JSON.stringify(users, null, 2), 'utf-8');

      // 6. ส่งข้อมูล User ที่เพิ่งสร้างเสร็จกลับไป
      return newUser;
    } catch {
      throw new InternalServerErrorException('Cannot create user');
    }
  }
}
