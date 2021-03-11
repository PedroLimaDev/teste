const dbConfig = require("./db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
    freezeTableName: true
  },
  //operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// sequelize
//   .authenticate()
//   .then(() => console.log("DB Running..."))
//   .catch((err) => console.log("Error: " + err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = require("../models/usuario.model")(sequelize, Sequelize);
db.task = require("../models/task.model")(sequelize, Sequelize);

db.sequelize.sync({force: false}).catch(err => {
  throw err
})

module.exports = db;
