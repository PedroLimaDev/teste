require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const db = require("./src/services/api/sConfig");

const port = process.env.APIPORT || 5000;

let listaUrlLiberadas = [
  `/usuario/login`,
  `/usuario/cadastro`

];

// AUTHENTICATION
app.use(async (req, res) => {
  console.log(req.url);
  if (listaUrlLiberadas && !listaUrlLiberadas.includes(req.url)) {
    if (validateRequest(req, res)) 
      return req.next();
    else {
      return res.sendStatus(401);
    }
  } 
  
  else return req.next();
});

app.use("/usuario", require("./src/services/routes/usuario.routes"));
app.use("/task", require("./src/services/routes/task.routes"));

function validateRequest(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("AQUI")
  console.log(req.headers)
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {return res.sendStatus(403)};
    req.user = user;
  });

  return true
}

app.listen(port, () => console.log(`Listening on port: ${port}`));
