import { DataTypes, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.addColumn('Nft', 'tokenId', {
      type: DataTypes.DECIMAL,
      allowNull: false,
    });
  },
  down: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.removeColumn('Nft', 'tokenId');
  },
};
