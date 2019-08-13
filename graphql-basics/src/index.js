'use strict'

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    title () {
      return 'Evangelion DVD'
    },
    price () {
      return 666.9
    },
    releaseYear () {
      return 2006
    },
    rating () {
      return 6.7
    },
    inStock () {
      return false
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
