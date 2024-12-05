const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('../data/users.json');
const db = low(adapter);

db.defaults({users: []}).write();

module.exports = db;