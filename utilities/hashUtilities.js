const bcrypt = require("bcryptjs");
const { SALT_ROUNDS } = require("../config/constants");

var encrypt = (data) => {
    var salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(data, salt);
};

var validate = (storedHash,providedHash) => {
    return bcrypt.compareSync(storedHash, providedHash);
};

module.exports = {
 encrypt,
 validate
};