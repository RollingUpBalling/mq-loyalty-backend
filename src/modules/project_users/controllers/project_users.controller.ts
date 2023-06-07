import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../../../utils/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { MulterError } from 'multer';
import { readCSV } from '../../../utils/parse_csv';
import { ProjectUsersService } from '../services/project_users.service';
import { UsersCreateDto } from '../dto/user_create.dto';
import { UsersUpdateDto } from '../dto/user_update.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: ProjectUsersService) {}

  @Get('getAll')
  async getAll(@Req() req) {
    return this.usersService.getAll(req.user.id);
  }

  @Get('getOne/:id')
  async getOne(@Req() req, @Param('id') id: string) {
    return this.usersService.getOne(req.user.id, id);
  }

  @Put('updateOne')
  async updateOne(@Req() req, @Body() body: UsersUpdateDto) {
    return this.usersService.updateOne(req.user.id, body);
  }

  @Post('createOne')
  async createOne(@Req() req, @Body() body: UsersCreateDto) {
    return this.usersService.create(req.user.id, body);
  }

  @Delete('deleteOne/:id')
  async deleteOne(@Req() req, @Param('id') id: string) {
    await this.usersService.deleteOne(req.user.id, id);
    return 'success';
  }

  @Get('search')
  async search(@Req() req, @Query('search') search: string) {
    return this.usersService.search(req.user.id, search);
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(csv)$/)) cb(null, true);
        else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'), false);
      },
    }),
  )
  async importWithCsv(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const stream = Readable.from(file.buffer);
    return this.usersService.import(req.user.id, stream);
  }
}
