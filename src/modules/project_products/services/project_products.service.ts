import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Clients } from '../../clients/models/clients.model';
import { LoginResponseDto } from '../../auth/dto/login.response.dto';
import axios, { AxiosResponse } from 'axios/index';
import { ErrorCode } from '../../../types/error_codes';
import { ProjectProducts } from '../models/project_products.model';
import { ProductCreateDto } from '../dto/product_create.dto';
import { ProductUpdateDto } from '../dto/products_update.dto';
import { Readable } from 'stream';
import { readCSV } from '../../../utils/parse_csv';
import { v4 } from 'uuid';
import { ProjectUsers } from '../../project_users/models/project_users.model';
import { Op } from 'sequelize';

@Injectable()
export class ProjectProductsService {
  private readonly logger: Logger = new Logger('PRODUCTS SERVICE');

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ProjectProducts) private productsModel: typeof ProjectProducts,
  ) {}

  public async create(
    clientId: string,
    body: ProductCreateDto,
  ): Promise<ProjectProducts> {
    console.log({ ...body, clientId });
    return this.productsModel.create({ ...body, clientId });
  }

  public async getOne(clientId: string, id: string): Promise<ProjectProducts> {
    return this.productsModel.findOne({ where: { clientId, id } });
  }

  public async getAll(clientId: string): Promise<ProjectProducts[]> {
    return this.productsModel.findAll({ where: { clientId } });
  }

  public async updateOne(
    clientId: string,
    body: ProductUpdateDto,
  ): Promise<ProjectProducts | null> {
    const product = await this.getOne(clientId, body.id);
    if (!product) {
      return null;
    }
    const items = await product.update(body);
    return items;
  }

  public async search(
    clientId: string,
    searchElement: string,
  ): Promise<ProjectProducts[]> {
    return this.productsModel.findAll({
      where: {
        clientId,
        [Op.or]: [
          {
            title: { [Op.like]: searchElement },
          },
          { description: { [Op.like]: searchElement } },
        ],
      },
    });
  }

  public async deleteOne(clientId: string, id: string): Promise<number> {
    return this.productsModel.destroy({ where: { id, clientId } });
  }

  public async import(
    clientId: string,
    stream: Readable,
  ): Promise<ProjectProducts[]> {
    const results = await readCSV(stream);
    const items = results
      .filter((el: any) => el.title && el.description && el.image)
      .map((el: { title: string; description: string; image: string }) => {
        return {
          id: v4(),
          clientId,
          title: el.title,
          description: el.description,
          image: el.image,
        };
      });

    console.log({ items });

    try {
      return this.productsModel.bulkCreate(items);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
