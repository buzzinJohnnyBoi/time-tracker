const express = require("express");
const app = express();
const connection = require("./db.js");
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post("/create", (req, res) => {
  console.log(req.body);
  // connection.query('INSERT INTO users (name) VALUES ("BOB");');
});


app.post("/get", (req, res) => {
  console.log(req.body);
  connection.query("SELECT * FROM workdays WHERE date = '"+ req.body.date +"' AND userId = "+ req.body.userId +";", function(error, results, fields) {
    if (error) {
      console.error(error);
    } else {
      if (results.length > 0) {
        const row = results[0];
        res.json({
          id: row.id,
          userId: row.userId,
          date: row.date,
          startTime: row.startTime,
          endTime: row.endTime,
          Timers: row.Timers,
        });
      } else {
        console.log('No rows found');
      }
    }
  });
  
});

app.post("/send", (req, res) => {
  console.log(req.body);
  const r = req.body;
  connection.query("SELECT * FROM workdays WHERE date = '"+ r.date +"' AND userId = "+ r.userId +";", function(error, results, fields) {
    if (error) {
      console.error(error);
    } else {
      if (results.length > 0) {
        const timers = JSON.stringify(r.Timers);
        console.log(r.Timers);
        console.log(timers);
        connection.query("UPDATE workdays SET startTime = '"+ r.startTime +"', endTime = '"+ r.endTime +"', Timers = '"+ timers +"' WHERE date = '"+ r.date +"' AND userId = "+ r.userId +";", function(error, results, fields) {
          if (error) {
            console.error(error);
          } else {
            console.log('Row updated successfully');
          }
        });
      } else {
        console.log(r.Timers);
        const timers = JSON.stringify(r.timers);
        connection.query("INSERT INTO workdays (userId, date, startTime, endTime, Timers) VALUES (?, ?, ?, ?, ?);", [r.userId, r.date, r.startTime, r.endTime, timers], function(error, results, fields) {
          if (error) {
            console.error(error);
          } else {
            console.log('Row updated successfully');
          }
        });
        console.log('No rows found');
      }
    }
  });
});

app.listen(3003, () => {
  console.log(`Server is listening on port ${3003}`);
});