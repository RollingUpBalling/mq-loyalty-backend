import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.createTable('BlockchainAddresses', {
      address: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id',
        },
      },
      privateKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('BlockchainAddresses');
  },
};
