import {  Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { timeoutProvider } from "rxjs/internal/scheduler/timeoutProvider";

@Module({
    controllers: [UserController],
    providers:[UserService],
})
export class UserModule {}