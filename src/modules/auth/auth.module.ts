import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../utils/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule } from '../clients/clients.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('jwt.secret'),
    signOptions: {
      expiresIn: configService.get('jwt.expiresIn'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    JwtModule.registerAsync(jwtFactory),
    BlockchainModule,
    ClientsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
