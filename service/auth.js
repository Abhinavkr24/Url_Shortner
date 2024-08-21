const jwt = require('jsonwebtoken');
const secret = "abhi@24$";

function setUser (user){
  return jwt.sign(user,secret);
}

function getUser (id) {
  return sessionIdToUserMap.get(id);
}

module.exports = {
  setUser,
  getUser,
}