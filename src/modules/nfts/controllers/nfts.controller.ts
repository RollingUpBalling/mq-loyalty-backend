import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../../../utils/guards/auth.guard';
import { NftsService } from '../services/nfts.service';
import { NftsCreateDto } from '../dto/nfts_create.dto';
import { NftsUpdateDto } from '../dto/nfts_update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';

@Controller('nfts')
@UseGuards(AuthGuard)
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Get('getAll')
  async getAll(@Req() req) {
    return this.nftsService.getAll(req.user.id);
  }

  @Get('getOne/:id')
  async getOne(@Req() req, @Param('id') id: string) {
    return this.nftsService.getOne(req.user.id, id);
  }

  @Put('updateOne')
  async updateOne(@Req() req, @Body() body: NftsUpdateDto) {
    return this.nftsService.updateOne(req.user.id, body);
  }

  @Get('search')
  async search(@Req() req, @Query('search') search: string) {
    return this.nftsService.search(req.user.id, search);
  }

  @Post('createOne')
  async createOne(@Req() req, @Body() body: NftsCreateDto) {
    return this.nftsService.create(req.user.id, body);
  }

  @Delete('deleteOne/:id')
  async deleteOne(@Req() req, @Param('id') id: string) {
    await this.nftsService.deleteOne(req.user.id, id);
    return 'success';
  }
}
