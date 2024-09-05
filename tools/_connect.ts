import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

export default async function connect(logger: Logger | Console = console): Promise<Sequelize> {
  const sequelize = new Sequelize(dbUrl, {
    logging: false,
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  try {
    logger.log('Connecting to database...');
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    logger.log('Could not connect to database', error);
    throw error;
  }
}
