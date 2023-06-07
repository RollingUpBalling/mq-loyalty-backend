import {
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
import { BlockchainAddresses } from '../../blockchain/models/blockchain_addresses.model';

@Table({ timestamps: true })
export class ProjectUsers extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4, defaultValue: DataType.UUIDV4 })
  id: string;

  @ForeignKey(() => Clients)
  @Column({ type: DataType.UUIDV4, allowNull: false })
  clientId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasOne(() => BlockchainAddresses, { foreignKey: 'userId' })
  address?: BlockchainAddresses;
}
