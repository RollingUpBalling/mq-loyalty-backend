import { DataTypes, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.addColumn('BlockchainAddresses', 'userId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ProjectUsers',
        key: 'id',
      },
    });
  },
  down: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.removeColumn('BlockchainAddresses', 'userId');
  },
};
