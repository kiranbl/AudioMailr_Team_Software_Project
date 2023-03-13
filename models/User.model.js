const { createQuery } = require("../utilities/dbUtilities.js");
var pool = require("../config/dbconfig.js");

// constructor
const User = function (user) {
  this.userName = user.userName;
  this.emailAddress1 = user.emailAddress1;
  this.password1 = user.password1;
  this.emailAddress2 = user.emailAddress2;
  this.password2 = user.password2;
};


User.create = async (newUser, result) => {
  let res = await pool.execute(`INSERT INTO user (userName,emailAddress1,password1,emailAddress2,password2)
   VALUES ( "${newUser.userName}", "${newUser.emailAddress1}", "${newUser.password1}", "${newUser.emailAddress2}", "${newUser.password2}")`);
  result(null, { id: res[0].insertId, ...newUser });
};



module.exports = User;