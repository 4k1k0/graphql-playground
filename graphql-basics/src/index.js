'use strict'

const { GraphQLServer } = require('graphql-yoga')
const db = require('./db')
const Comment = require('./resolvers/Comment')
const Mutation = require('./resolvers/Mutation')
const Post = require('./resolvers/Post')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')

const resolvers = {
  Comment,
  Mutation,
  Post,
  Query,
  User
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
})

server.start(() => {
  console.log('The server is up!')
})
