const db = require("../api/sConfig");
const Tasks = db.task;
const Op = db.Sequelize.Op;

// Find a single User with an id
exports.findOne = (req, res) => {
  console.log(req);
};


// Create and Save a new Users
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nome || !req.body.descricao) {
    console.log("catch")
    // res.status(400).send({
    //   message: "Content can not be empty!",
    // });
    return;
  }
  
  // Create a user
  const task = {
    nome: req.body.nome,
    descricao: req.body.descricao,
    data: new Date(),
    status: "NOT DONE",
    owner: req.body.owner
  };
  
  // Save Users in the database
  Tasks.create(task)
  .then((data) => {
      //console.log(data)
      res.send(data);
    })
    .catch((err) => {
      console.log(err)
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const owner = req.body.owner

  Tasks.findAll({ where: { owner:owner }})  
    .then((data) => {
      res.send(data);
      //console.log(data);
    })
    .catch((err) => {
      console.log(err)
    });

};

// Update a user by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tasks.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tasks.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      }
    })
    .catch((err) => {
      console.log(err)
    });
};
