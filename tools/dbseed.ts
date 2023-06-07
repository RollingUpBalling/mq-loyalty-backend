import { Logger } from '@nestjs/common';
import seedDatabase from '../database/seeders';
import connect from './_connect';

async function seed() {
  const logger = new Logger('DB SEED');
  try {
    const sequelize = await connect();
    await seedDatabase(sequelize, logger);
    await sequelize.close();
  } catch (error) {
    logger.log(error);
  }
}

seed();
