import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { NftsService } from './services/nfts.service';
import { NftsController } from './controllers/nfts.controller';
import { Nft } from './models/nfts.model';
import { ImageUploaderModule } from '../image_uploader/image_uploader.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    JwtModule,
    ImageUploaderModule,
    forwardRef(() => BlockchainModule),
    SequelizeModule.forFeature([Nft]),
  ],
  controllers: [NftsController],
  providers: [NftsService],
  exports: [SequelizeModule, NftsService],
})
export class NftsModule {}
