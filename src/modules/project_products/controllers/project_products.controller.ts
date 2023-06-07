import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
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
import { ProjectProductsService } from '../services/project_products.service';
import { ProductCreateDto } from '../dto/product_create.dto';
import { ProductUpdateDto } from '../dto/products_update.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProjectProductsService) {}

  @Get('getAll')
  async getAll(@Req() req) {
    return this.productsService.getAll(req.user.id);
  }

  @Get('getOne/:id')
  async getOne(@Req() req, @Param('id') id: string) {
    return this.productsService.getOne(req.user.id, id);
  }

  @Put('updateOne')
  async updateOne(@Req() req, @Body() body: ProductUpdateDto) {
    return this.productsService.updateOne(req.user.id, body);
  }

  @Get('search')
  async search(@Req() req, @Query('search') search: string) {
    return this.productsService.search(req.user.id, search);
  }

  @Post('createOne')
  async createOne(@Req() req, @Body() body: ProductCreateDto) {
    return this.productsService.create(req.user.id, body);
  }

  @Delete('deleteOne/:id')
  async deleteOne(@Req() req, @Param('id') id: string) {
    await this.productsService.deleteOne(req.user.id, id);
    return 'success';
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
    return this.productsService.import(req.user.id, stream);
  }
}
