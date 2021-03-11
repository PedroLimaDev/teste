
const tasks = require("../controllers/task.controller");

var router = require("express").Router();

// Create a new user
router.post("/criar", tasks.create);

// Retrieve all users
router.post("/all", tasks.findAll);

// Retrieve a single user with email
router.post("/:id", tasks.findOne);

// Update a user with id
router.put("/alterar/:id", tasks.update);

// Delete a user with id
router.delete("/apagar/:id", tasks.delete);


module.exports = router;
