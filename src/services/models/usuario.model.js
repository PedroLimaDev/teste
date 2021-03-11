module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define("usuario", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    senha: {
      type: Sequelize.STRING,
    },
    tasks: {
      type: Sequelize.STRING,
    },
  });

  return Usuario;
};
