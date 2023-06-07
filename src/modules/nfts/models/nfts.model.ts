import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Index,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Clients } from '../../clients/models/clients.model';
import { ProjectUsers } from '../../project_users/models/project_users.model';
import { ProjectProducts } from '../../project_products/models/project_products.model';
import { CoolDownEnum } from '../types/coolDown.enum';
import { BlockchainAddresses } from '../../blockchain/models/blockchain_addresses.model';

@Table({ timestamps: true })
export class Nft extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4, defaultValue: DataType.UUIDV4 })
  id: string;

  @ForeignKey(() => Clients)
  @Column({ type: DataType.UUIDV4, allowNull: false })
  clientId: string;

  @ForeignKey(() => ProjectProducts)
  @Column({ type: DataType.UUIDV4 })
  projectProductId: string;

  @ForeignKey(() => ProjectUsers)
  @Column({ type: DataType.UUIDV4 })
  projectUserId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 100 })
  discountPercentage: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  minted: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  blockchainLink: string;

  @ForeignKey(() => BlockchainAddresses)
  @Column({ type: DataType.STRING, allowNull: false })
  contractAddress: string;

  @Column({ type: DataType.STRING, defaultValue: CoolDownEnum.Once })
  coolDown: CoolDownEnum;

  @Column({ type: DataType.DECIMAL, allowNull: true })
  tokenId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => ProjectUsers)
  user?: ProjectUsers;

  @BelongsTo(() => ProjectProducts)
  product?: ProjectProducts;
}
