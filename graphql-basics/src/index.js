'use strict'

const { GraphQLServer } = require('graphql-yoga')
const uuidv4 = require('uuid/v4')

let users = [
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

let posts = [
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

let comments = [
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
    createUser (data: CreateUserInput!): User!
    deleteUser (id: ID!): User! 
    createPost (data: CreatePostInput!): Post!
    deletePost (id: ID!): Post!
    createComment (data: CreateCommentInput!): Comment!
    deleteComment (id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    tittle: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
      const { data } = args
      const { name, email, age } = data
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
    },
    deleteUser (parent, args, ctx, info) {
      const userIndex = users.findIndex(u => u.id === args.id)
      if (userIndex === -1) throw new Error('User does not exists :(')
      const deletedUsers = users.splice(userIndex, 1)
      posts = posts.filter(post => {
        const match = post.autho === args.id
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })

      comments = comments.filter(comments => comments.author !== args.id)
      return deletedUsers[0]
    },
    createPost (parent, args, ctx, info) {
      const { data } = args
      const { tittle, body, published, author } = data
      const userExists = users.some(user => user.id === author)
      if (!userExists) throw new Error('User does not exists :(')
      const post = {
        id: uuidv4(),
        tittle,
        body,
        published,
        author
      }
      posts.push(post)
      return post
    },
    deletePost (parent, args, ctx, info) {
      const postIndex = posts.findIndex(p => p.id === args.id)
      if (postIndex === -1) throw new Error('Post does not exists :(')
      const deletedPosts = posts.splice(postIndex, 1)
      comments = comments.filter(c => c.post !== args.id)
      return deletedPosts[0]
    },
    createComment (parent, args, ctx, info) {
      const { data } = args
      const { text, author, post } = data
      const userExists = users.some(user => user.id === author)
      const postExists = posts.some(p => p.id === post && p.published)
      if (!userExists || !postExists) throw new Error('User or post does not exists :(')
      const comment = {
        id: uuidv4(),
        text,
        author,
        post
      }
      comments.push(comment)
      return comment
    },
    deleteComment (parent, args, ctx, info) {
      const commentIndex = comments.findIndex(c => c.id === args.id)
      if (commentIndex === -1) throw new Error('Comment does not exists :(')
      const deletedComments = comments.splice(commentIndex, 1)
      return deletedComments[0]
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
