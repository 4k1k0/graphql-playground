'use strict'

const { GraphQLServer } = require('graphql-yoga')
const db = require('./db')
const resolvers = require('./resolvers')

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
