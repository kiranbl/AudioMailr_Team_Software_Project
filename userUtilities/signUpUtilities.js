const User = require("../models/User.model.js");
const validator = require('validator');
// Create and Save a new user
exports.create = (req, res) => {
  
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // validation
  if(validator.isEmpty(req.body.userName) || !validator.isLength(req.body.userName,{minLength: 5}) ){
   res.status(400).send({
        message: "invalid username,  should be minimum 5 character"
      });
  }
  if(validator.isEmpty(req.body.emailAddress1) || !validator.isEmail(req.body.emailAddress1)){
   res.status(400).send({
        message: "invalid email address1"
      });
  }
  if(validator.isEmpty(req.body.password1) || validator.isStrongPassword(req.body.password1,{minLength: 8})){
     res.status(400).send({
          message: "invalid password1, should be minimum 8 character"
        });
    }
  if(validator.isEmpty(req.body.emailAddress2) || !validator.isEmail(req.body.emailAddress2)){
     res.status(400).send({
          message: "invalid email address2"
        });
    }
    if(validator.isEmpty(req.body.password2) || validator.isStrongPassword(req.body.password2,{minLength: 8})){
         res.status(400).send({
              message: "invalid password2, should be minimum 8 character"
            });
    }



  // Create a user
  const user = new User({
    userName: req.body.userName,
    emailAddress1: req.body.emailAddress1,
    password1: req.body.password1,
    emailAddress2: req.body.emailAddress2,
    password2: req.body.password2,

  });

  // Save User in the database
  User.create(user, (err, data) => {
  console.log(data);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};


