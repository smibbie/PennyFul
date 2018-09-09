// Model for budgets - dependent on User
module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define("Budget", {
    total_balance: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: true
    },
    amount_spent: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: true
    },
    monthly_goal: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: true
    },
    month: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Budget.associate = (models) => {
    // We're saying that a Budget should belong to an User
    // A Budget can't be created without a User due to the foreign key constraint
    Budget.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Budget;
};
