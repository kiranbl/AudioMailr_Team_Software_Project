const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
//const debug = require("debug")("my-application");
// Add the cors middleware
app.use(cors());

// Add this line to use express.json() middleware
app.use(express.json());



// Use routes
app.use("/api", require("./routes/routes.js"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  //debug()
});
