import {
  Controller,
  FileTypeValidator,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../../utils/guards/auth.guard';
import { NftsService } from '../../nfts/services/nfts.service';
import { S3Service } from '../services/image_uploader.service';

@Controller('image')
@UseGuards(AuthGuard)
export class ImageUploaderController {
  constructor(private readonly s3service: S3Service) {}

  @Post('getLink')
  @UseInterceptors(FileInterceptor('file'))
  async imageUpload(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.s3service.uploadFile(file);

    if (!result.success) {
      throw new InternalServerErrorException('Image uploading failed');
    }

    const url = this.s3service.formatObjetUrl(file.originalname);

    return url;
  }
}
