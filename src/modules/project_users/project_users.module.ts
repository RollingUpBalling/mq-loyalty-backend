import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './controllers/project_users.controller';
import { ProjectUsersService } from './services/project_users.service';
import { JwtModule } from '@nestjs/jwt';
import { ProjectUsers } from './models/project_users.model';

@Module({
  imports: [JwtModule, SequelizeModule.forFeature([ProjectUsers])],
  controllers: [UsersController],
  providers: [ProjectUsersService],
  exports: [SequelizeModule, ProjectUsersService],
})
export class ProjectUsersModule {}
