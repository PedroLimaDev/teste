
const usuarios = require("../controllers/usuario.controller");

var router = require("express").Router();

// Create a new user
router.post("/cadastro", usuarios.create);

// Retrieve a single user with email
router.post("/login", usuarios.findByUsername);


module.exports = router;
