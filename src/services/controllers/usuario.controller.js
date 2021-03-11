const db = require("../api/sConfig");
const jwt = require("jsonwebtoken");
const Usuarios = db.usuario;
const Op = db.Sequelize.Op;

// Create and Save a new Users
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nome) {
    console.log("ERRO CREATE");
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  
//   // Create a user
    const usuario = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      tasks: ''
    };

    console.log(usuario)

//   // Save Users in the database
    Usuarios.create(usuario)
      .then((data) => {
        console.log("CRIOU")
        res.send(data);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          message: err.message || "Some error occurred while creating the user.",
        });
      });
};

// Find a single User with an id
exports.findByUsername = async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  var format = /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
  if(format.test(email) == true || format.test(senha) == true) {
    console.log("CATCHOU1")
    res.status(500).send({
      message: "Error retrieving data",
    });
  }
  else {
    console.log("ELSE")
    const found = await Usuarios.findOne({ where: { email: email } })
      .then((data) => {
        const filter = data.dataValues;

        if(filter.senha === senha)
        {
          const response = { 
            nome: filter.nome, 
            email: filter.email, 
            token: createToken(filter.email) 
          };

          res.send(response);
        }

        else {
          res.status(500).send({
            message: "Error retrieving data",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error retrieving data",
        });
      });
  }
};

const createToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
