import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.createTable('Nft', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      projectProductId: {
        type: DataTypes.UUID,
        references: {
          model: 'ProjectProducts',
          key: 'id',
        },
      },
      projectUserId: {
        type: DataTypes.UUID,
        references: {
          model: 'ProjectUsers',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      minted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      blockchainLink: {
        type: DataTypes.STRING,
      },
      coolDown: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contractAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'BlockchainAddresses',
          key: 'address',
        },
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
    await queryInterface.dropTable('Nft');
  },
};
