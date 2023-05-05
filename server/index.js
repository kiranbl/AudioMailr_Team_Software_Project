require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors'); // Added this line to import CORS
const port = 3000;
const router = require("./routes/routes");
var bodyParser = require('body-parser');
const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3001/mailbox"],
  credentials: true, // This is important for allowing cookies
  optionSuccessStatus:200
};


app.use(bodyParser.json());

// Use the CORS middleware
app.use(cors(corsOptions));
app.use(router);

app.listen(port, () => {
  console.log(`AudioMailr app listening on port ${port}`)
})