import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger: Logger = new Logger('UPLOAD IMAGE SERVICE');

  private readonly client: S3;
  constructor(private readonly configService: ConfigService) {
    this.client = new S3({
      endpoint: 'https://fra1.digitaloceanspaces.com',
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('s3.spaceAccessKey'),
        secretAccessKey: this.configService.get('s3.spacePrivateKey'),
      },
    });
  }

  public async uploadFile(file: Express.Multer.File) {
    try {
      console.log({ file });
      const bucketParams = {
        Bucket: this.configService.get('s3.bucket'),
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read',
      };

      await this.client.send(new PutObjectCommand(bucketParams));
      console.log(
        'Successfully uploaded object: ' +
          bucketParams.Bucket +
          '/' +
          bucketParams.Key,
      );

      return { success: true };
    } catch (error) {
      console.log(error);
      console.log('Error while uploading file');
      throw new InternalServerErrorException('Error while uploading file');
    }
  }

  public formatObjetUrl(key: string) {
    return `https://${this.configService.get(
      's3.bucket',
    )}.fra1.digitaloceanspaces.com/${key}`;
  }
}
