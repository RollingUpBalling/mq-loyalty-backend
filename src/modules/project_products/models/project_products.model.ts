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

@Table({ timestamps: true })
export class ProjectProducts extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4, defaultValue: DataType.UUIDV4 })
  id: string;

  @ForeignKey(() => Clients)
  @Column({ type: DataType.UUIDV4, allowNull: false })
  clientId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
