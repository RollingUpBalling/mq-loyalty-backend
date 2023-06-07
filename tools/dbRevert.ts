import * as Umzug from 'umzug';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import connect from './_connect';

async function migrateAll() {
  const logger = new Logger('DB MIGRATE');
  logger.log('Running migrations...');
  try {
    const sequelize = await connect();

    // @ts-ignore
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: { sequelize },
      logging: (msg: string) => {
        logger.log(msg);
      },
      migrations: {
        params: [sequelize, logger],
        path: path.join(__dirname, '..', 'database', 'migrations'),
        pattern: RegExp("(.ts|.js)$"),
      },
    });
    await umzug.down();
    await sequelize.close();
  } catch (error) {
    logger.log(error);
  }
}

migrateAll();
