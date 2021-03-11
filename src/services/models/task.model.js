module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: Sequelize.STRING,
    },
    descricao: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.DATEONLY,
    },
    status: {
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.STRING
    }

  });

  return Task;
};