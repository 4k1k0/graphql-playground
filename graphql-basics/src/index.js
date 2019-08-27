'use strict'

const { GraphQLServer, PubSub } = require('graphql-yoga')
const db = require('./db')
const resolvers = require('./resolvers')

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub
  }
})

server.start(() => {
  console.log('The server is up!')
})
