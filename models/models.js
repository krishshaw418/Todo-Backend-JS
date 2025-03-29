const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');
const todoSchema = require('../schemas/todoSchema');
const Todos = mongoose.model('todos', todoSchema);
const Users = mongoose.model('users', userSchema);
module.exports = {Todos, Users};