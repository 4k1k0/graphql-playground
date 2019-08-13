'use strict'

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    me: User!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`

// Resolvers
const resolvers = {
  Query: {
    me () {
      return {
        id: '666ddd',
        name: 'Wako',
        email: 'wako@wako.com',
        age: null
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
