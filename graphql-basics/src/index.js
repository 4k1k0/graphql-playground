'use strict'

const { GraphQLServer } = require('graphql-yoga')
const uuidv4 = require('uuid/v4')

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

const comments = [
  {
    id: '1',
    text: 'First comment!',
    author: '1',
    post: '2'
  },
  {
    id: '2',
    text: 'Second comment',
    author: '2',
    post: '2'
  },
  {
    id: '3',
    text: 'Third comment',
    author: '1',
    post: '2'
  },
  {
    id: '4',
    text: 'Fourth comment',
    author: '3',
    post: '1'
  }
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser (name: String!, email: String!, age: Int): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    tittle: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments () {
      return comments
    }
  },
  Mutation: {
    createUser (parent, args, ctx, info) {
      const { name, email, age } = args
      const emailTaken = users.some(user => user.email === email)
      if (emailTaken) throw new Error('Email taken :(')
      const user = {
        id: uuidv4(),
        name,
        email,
        age
      }
      users.push(user)
      return user
    }
  },
  Post: {
    author (parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    comments (parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts (parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments (parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author (parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    post (parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
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
