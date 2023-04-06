require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const router = require("./routes/routes");
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(router);



app.listen(port, () => {
  console.log(`AudioMailr app listening on port ${port}`)
})