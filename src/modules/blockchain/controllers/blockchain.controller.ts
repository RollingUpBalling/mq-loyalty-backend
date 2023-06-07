import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../utils/guards/auth.guard';
import { BlockchainService } from '../services/blockchain.service';

@Controller('smart-contract')
@UseGuards(AuthGuard)
export class SmartContractsController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('createContract')
  async create(@Req() req) {
    return this.blockchainService.createSmartContractAddress(req.user.id);
  }

  // @Post('addMetadata')
  // async addMetadata(@Req() req, @Body() { tokenId }: { tokenId: string }) {
  //   return this.blockchainService.addMetadata(req.user.id, tokenId, {title: '', });
  // }

  @Post('openSales')
  async openSales(@Req() req) {
    return this.blockchainService.openSales(req.user.id);
  }

  @Get('checkNft')
  async checkNft(@Req() req, @Query('tokenId') tokenId: string) {
    return this.blockchainService.checkNftProperties(req.user.id, tokenId);
  }

  @Post('mintNft')
  async mintNft(
    @Req() req,
    @Body() { userId, nftId }: { userId: string; nftId: string },
  ) {
    const { address } = await this.blockchainService.createAddress(
      req.user.id,
      userId,
    );

    return this.blockchainService.mintNft(req.user.id, userId, address, nftId);
  }
}
