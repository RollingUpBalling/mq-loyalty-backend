import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './controllers/project_products.controller';
import { JwtModule } from '@nestjs/jwt';
import { ProjectProducts } from './models/project_products.model';
import { ProjectProductsService } from './services/project_products.service';

@Module({
  imports: [JwtModule, SequelizeModule.forFeature([ProjectProducts])],
  controllers: [ProductsController],
  providers: [ProjectProductsService],
  exports: [SequelizeModule],
})
export class ProjectProductsModule {}
