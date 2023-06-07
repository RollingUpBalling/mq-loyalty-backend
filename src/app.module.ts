import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ClientsModule } from './modules/clients/clients.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Clients } from './modules/clients/models/clients.model';
import { NftsModule } from './modules/nfts/nfts.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectUsersModule } from './modules/project_users/project_users.module';
import { ProjectProductsModule } from './modules/project_products/project_products.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectProducts } from './modules/project_products/models/project_products.model';
import { ProjectUsers } from './modules/project_users/models/project_users.model';
import { Nft } from './modules/nfts/models/nfts.model';
import { BlockchainAddresses } from './modules/blockchain/models/blockchain_addresses.model';
import { ImageUploaderModule } from './modules/image_uploader/image_uploader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          database: configService.get<string>('database.name'),
          password: configService.get<string>('database.password'),
          dialectOptions: {
            ssl: {
              required: true,
              rejectUnauthorized: false,
            },
          },
          ssl: true,
          models: [
            Clients,
            ProjectProducts,
            ProjectUsers,
            Nft,
            BlockchainAddresses,
          ],
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule,
    NftsModule,
    ProjectsModule,
    ProjectUsersModule,
    ImageUploaderModule,
    ProjectProductsModule,
    AuthModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
