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

@Table({ timestamps: true })
export class Clients extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4, defaultValue: v4() })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
