import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Nft } from '../models/nfts.model';
import { NftsCreateDto } from '../dto/nfts_create.dto';
import { NftsUpdateDto } from '../dto/nfts_update.dto';
import { Op } from 'sequelize';
import { ProjectProducts } from '../../project_products/models/project_products.model';
import { NotFoundError } from 'rxjs';
import { ProjectUsers } from '../../project_users/models/project_users.model';
import { S3Service } from '../../image_uploader/services/image_uploader.service';
import { BlockchainService } from '../../blockchain/services/blockchain.service';

@Injectable()
export class NftsService {
  private readonly logger: Logger = new Logger('Nfts SERVICE');

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => BlockchainService))
    private readonly blockchainService: BlockchainService,
    private readonly s3Service: S3Service,
    @InjectModel(Nft) private nftsModel: typeof Nft,
  ) {}

  public async create(clientId: string, body: NftsCreateDto): Promise<Nft> {
    try {
      if (body.projectProductId) {
        const product = await ProjectProducts.findByPk(body.projectProductId);
        if (!product) {
          throw new NotFoundError('product has not been found');
        }
      }

      if (body.projectUserId) {
        const user = await ProjectUsers.findByPk(body.projectUserId);
        if (!user) {
          throw new NotFoundError('user has not been found');
        }
      }

      const contractAddress = await this.blockchainService.getContractAddress(
        clientId,
      );

      const tokenId = await this.nftsModel.count({ where: { clientId } });

      const createdNft = await this.nftsModel.create({
        ...body,
        contractAddress,
        clientId,
        tokenId,
      });

      await this.blockchainService.addMetadata(clientId, tokenId.toString(), {
        title: createdNft.title,
        description: createdNft.description,
        media: createdNft.image,
      });
      return createdNft;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('server error');
    }
  }

  public async getOne(clientId: string, id: string): Promise<Nft> {
    return this.nftsModel.findOne({
      where: { clientId, id },
      include: [
        {
          model: ProjectProducts,
          as: 'product',
        },
        { model: ProjectUsers, as: 'user' },
      ],
    });
  }

  public async getAll(clientId: string): Promise<Nft[]> {
    return this.nftsModel.findAll({
      where: { clientId },
      include: [
        {
          model: ProjectProducts,
          as: 'product',
        },
        { model: ProjectUsers, as: 'user' },
      ],
    });
  }

  public async updateOne(
    clientId: string,
    body: NftsUpdateDto,
  ): Promise<Nft | null> {
    if (body.projectProductId) {
      const product = await ProjectProducts.findByPk(body.projectProductId);
      if (!product) {
        throw new NotFoundError('product has not been found');
      }
    }

    if (body.projectUserId) {
      const user = await ProjectUsers.findByPk(body.projectUserId);
      if (!user) {
        throw new NotFoundError('user has not been found');
      }
    }
    const nft = await this.getOne(clientId, body.id);
    if (!nft) {
      return null;
    }
    const items = await nft.update(body);

    const metadataUpdate = await this.blockchainService.addMetadata(
      clientId,
      items.tokenId.toString(),
      {
        title: items.title,
        description: items.description,
        media: items.image,
      },
    );
    return items;
  }

  public async search(clientId: string, searchElement: string): Promise<Nft[]> {
    return this.nftsModel.findAll({
      where: {
        clientId,
        [Op.or]: [
          {
            title: { [Op.like]: searchElement },
          },
          { id: { [Op.like]: searchElement } },
        ],
      },
    });
  }

  public async deleteOne(clientId: string, id: string): Promise<number> {
    return this.nftsModel.destroy({ where: { id, clientId } });
  }
}
