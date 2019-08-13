'use strict'

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    sum(a: Float!, b: Float!): Float!
    me: User!
    post: Post!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  type Post {
    id: ID!
    tittle: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    greeting (parent, args) {
      return `Hello ${args.name}. You are my favorite ${args.position}`
    },
    sum (parent, args) {
      return args.a + args.b
    },
    me () {
      return {
        id: '666ddd',
        name: 'Wako',
        email: 'wako@wako.com',
        age: null
      }
    },
    post () {
      return {
        id: '9992ss',
        tittle: 'My first post',
        body: 'Lorem Ipsum',
        published: false
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
