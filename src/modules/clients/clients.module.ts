import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Clients } from './models/clients.model';
import {ClientsController} from "./controllers/clients.controller";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [JwtModule, SequelizeModule.forFeature([Clients])],
  controllers: [ClientsController],
  providers: [],
  exports: [SequelizeModule],
})
export class ClientsModule {}
