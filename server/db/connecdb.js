const mongoose = require('mongoose');

const connect = async (url) => {
  const db = await mongoose.connect(url);
  console.log('Connect to DB');
  return db;
};

module.exports = connect;
