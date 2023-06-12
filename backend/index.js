const express = require("express");
const app = express();
const connection = require("./db.js");
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post("/create", (req, res) => {
  console.log(req.body);
  connection.query('INSERT INTO users (name) VALUES ("BOB");');
})

app.listen(3003, () => {
  console.log(`Server is listening on port ${3003}`);
});