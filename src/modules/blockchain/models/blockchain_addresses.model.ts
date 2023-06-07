import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
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

@Table({ timestamps: true })
export class BlockchainAddresses extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  address: string;

  @ForeignKey(() => Clients)
  @Column({ type: DataType.UUIDV4, allowNull: false })
  clientId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  privateKey: string;

  @Column({ type: DataType.STRING, defaultValue: 'userAddress' })
  addressType: string;

  @ForeignKey(() => ProjectUsers)
  @Column({ type: DataType.STRING })
  userId?: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
