import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { ErrorCode } from '../../../types/error_codes';
import { ProjectUsers } from '../models/project_users.model';
import { UsersCreateDto } from '../dto/user_create.dto';
import { UsersUpdateDto } from '../dto/user_update.dto';
import { Readable } from 'stream';
import { readCSV } from '../../../utils/parse_csv';
import { v4 } from 'uuid';
import { Op } from 'sequelize';
import { BlockchainAddresses } from '../../blockchain/models/blockchain_addresses.model';

@Injectable()
export class ProjectUsersService {
  private readonly logger: Logger = new Logger('USERS SERVICE');

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ProjectUsers) private usersModel: typeof ProjectUsers,
  ) {}

  public async create(
    clientId: string,
    body: UsersCreateDto,
  ): Promise<ProjectUsers> {
    return this.usersModel.create({ ...body, clientId });
  }

  public async getOne(clientId: string, id: string): Promise<ProjectUsers> {
    return this.usersModel.findOne({
      where: { clientId, id },
      include: { model: BlockchainAddresses, as: 'address' },
    });
  }

  public async search(
    clientId: string,
    searchElement: string,
  ): Promise<ProjectUsers[]> {
    return this.usersModel.findAll({
      where: {
        clientId,
        [Op.or]: [
          {
            name: { [Op.like]: searchElement },
          },
          { email: { [Op.like]: searchElement } },
          { phone: { [Op.like]: searchElement } },
        ],
      },
      include: { model: BlockchainAddresses, as: 'address' },
    });
  }

  public async getAll(clientId: string): Promise<ProjectUsers[]> {
    return this.usersModel.findAll({
      where: { clientId },
      include: { model: BlockchainAddresses, as: 'address' },
    });
  }

  public async updateOne(
    clientId: string,
    body: UsersUpdateDto,
  ): Promise<ProjectUsers | null> {
    const user = await this.getOne(clientId, body.id);
    if (!user) {
      return null;
    }
    const items = await user.update(body);
    return items;
  }

  public async deleteOne(clientId: string, id: string): Promise<number> {
    return this.usersModel.destroy({ where: { id, clientId } });
  }

  public async import(
    clientId: string,
    stream: Readable,
  ): Promise<ProjectUsers[]> {
    const results = await readCSV(stream);
    const items = results
      .filter((el: any) => el.title && el.description && el.image)
      .map((el: { name: string; phone: string; email: string }) => {
        return {
          id: v4(),
          clientId,
          name: el.name,
          phone: el.phone,
          email: el.email,
        };
      });

    console.log({ items });

    try {
      return this.usersModel.bulkCreate(items);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
