import { Logger } from '@nestjs/common';
import connect from './_connect';

async function reset() {
  const logger = new Logger('DB RESET');
  logger.log('Reseting database...');
  try {
    const sequelize = await connect();
    const queryInterface = sequelize.getQueryInterface();
    logger.log('Resetting database...');
    await queryInterface.dropAllTables();
    await sequelize.close();
  } catch (error) {
    logger.log(error);
  }
}

reset();
