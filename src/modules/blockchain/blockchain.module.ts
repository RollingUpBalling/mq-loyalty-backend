import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlockchainService } from './services/blockchain.service';
import { SmartContractsController } from './controllers/blockchain.controller';
import { JwtModule } from '@nestjs/jwt';
import { BlockchainAddresses } from './models/blockchain_addresses.model';
import { ProjectUsersModule } from '../project_users/project_users.module';
import { NftsModule } from '../nfts/nfts.module';

@Module({
  imports: [
    JwtModule,
    ProjectUsersModule,
    forwardRef(() => NftsModule),
    SequelizeModule.forFeature([BlockchainAddresses]),
  ],
  controllers: [SmartContractsController],
  providers: [BlockchainService],
  exports: [JwtModule, BlockchainService],
})
export class BlockchainModule {}
