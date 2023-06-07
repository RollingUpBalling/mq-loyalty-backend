/* eslint-disable max-len */
import type { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize';

export default async function run(sequelize: Sequelize, logger: Logger): Promise<void> {
  await sequelize.query(`INSERT INTO "User"(id, role, "ethAccountId", "createdAt", "updatedAt", "deletedAt")
    VALUES ('00000001-cafe-babe-defe-c8eddeadbeef', 'ADMIN', '0xE00424ff4bE3c5ed1ED03542767B90b1d220F4e0', current_date, current_date, NULL) ON CONFLICT DO NOTHING;`); // eslint-disable-line
}
