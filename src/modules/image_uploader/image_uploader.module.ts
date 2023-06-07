import { Module } from '@nestjs/common';
import { S3Service } from './services/image_uploader.service';
import { ImageUploaderController } from './controllers/image_uploader.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [ImageUploaderController],
  providers: [S3Service],
  exports: [S3Service],
})
export class ImageUploaderModule {}
