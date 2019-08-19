'use strict'

const { GraphQLServer } = require('graphql-yoga')

const users = [
  {
    id: '1',
    name: 'Wako',
    email: 'wako@gmail.com',
    age: 26
  },
  {
    id: '2',
    name: 'Akko',
    email: 'akko@gmail.com'
  },
  {
    id: '3',
    name: 'Akiko',
    email: 'akiko@gmail.com',
    age: 22
  },
  {
    id: '4',
    name: 'Kagome',
    email: 'kagome@gmail.com',
    age: 16
  }
]

const posts = [
  {
    id: '1',
    tittle: 'Hello World!',
    body: 'Lorem Ipsum',
    published: true,
    author: '1'
  },
  {
    id: '2',
    tittle: 'Hello from Graphql!',
    body: 'Lorem QL',
    published: true,
    author: '3'
  },
  {
    id: '3',
    tittle: 'Hello from Node.js!',
    body: 'Lorem Node',
    published: false,
    author: '1'
  }
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }
  type Post {
    id: ID!
    tittle: String!
    body: String!
    published: Boolean!
    author: User!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users (parent, args) {
      return args.query ? users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase())) : users
    },
    posts (parent, args) {
      return args.query ? posts.filter(p => p.tittle.toLowerCase().includes(args.query.toLowerCase())) : posts
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
  },
  Post: {
    author (parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    }
  },
  User: {
    posts (parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
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
