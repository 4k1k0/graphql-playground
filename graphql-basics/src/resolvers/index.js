const Comment = require('./Comment')
const Mutation = require('./Mutation')
const Post = require('./Post')
const Query = require('./Query')
const User = require('./User')

const resolvers = {
  Comment,
  Mutation,
  Post,
  Query,
  User
}

module.exports = resolvers
