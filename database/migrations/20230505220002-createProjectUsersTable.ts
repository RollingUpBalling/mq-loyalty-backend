import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.createTable('ProjectUsers', {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
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
    await queryInterface.dropTable('ProjectUsers');
  },
};
