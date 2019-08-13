'use strict'

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`

// Resolvers
const resolvers = {
  Query: {
    id () {
      return '@akkonomi'
    },
    name () {
      return 'Wako'
    },
    age () {
      return 26
    },
    employed () {
      return true
    },
    gpa () {
      return null
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
